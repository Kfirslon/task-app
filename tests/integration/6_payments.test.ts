import { supabase, supabaseServiceClient } from "../test-utils/supabase-client";
import { describe, expect, test } from "@jest/globals";
import Stripe from "stripe";
import {
  TestUser,
  getOrCreateTestUser,
  cleanupTestUser,
} from "../test-utils/user-testing-utils";
import {
  setUserSubscriptionTier,
  TASK_LIMITS,
} from "../test-utils/limit-testing-utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const WEBHOOK_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/stripe-webhook`;
const TEST_USER_GREG = {
  name: "Greg (Test User)",
  email: "test-user.greg@pixegami.io",
  password: "Test123!@#Greg",
};

describe("Suite 6: Stripe Payments Integration", () => {
  let customerId: string;
  let testUser: TestUser | null;
  let paymentMethodId: string;

  const createPaymentMethod = async () => {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    paymentMethodId = paymentMethod.id;

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    console.log(
      `💳 Created Payment Method ${paymentMethodId} for Customer: ${customerId}`
    );
  };

  const sendWebhookEvent = async (event: any) => {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Stripe-Signature": stripe.webhooks.generateTestHeaderString({
          payload: JSON.stringify(event),
          secret: process.env.STRIPE_WEBHOOK_SECRET!,
        }),
      },
      body: JSON.stringify(event),
    });
    console.log(`👉 Webhook Response: ${response.status}`);
    return response;
  };

  const createSubscription = async () => {
    if (!paymentMethodId) {
      throw new Error("Payment method ID not set");
    }
    console.log(`👉 Creating Subscription with Payment ID: ${paymentMethodId}`);
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: process.env.STRIPE_PRICE_ID }],
      trial_period_days: 0,
      default_payment_method: paymentMethodId,
    });
    return subscription;
  };

  beforeAll(async () => {
    testUser = await getOrCreateTestUser(TEST_USER_GREG);

    // Get the corresponding Stripe customer ID.
    const { data: profile } = await supabaseServiceClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", testUser?.id)
      .single();

    if (!profile) {
      throw new Error("No profile found");
    }

    customerId = profile.stripe_customer_id;

    // If no Stripe customer exists, create one manually
    if (!customerId || customerId === "") {
      console.log("No Stripe customer found, creating one manually...");
      const stripeCustomer = await stripe.customers.create({
        email: testUser.email,
        name: TEST_USER_GREG.name,
      });
      customerId = stripeCustomer.id;

      // Update the profile with the Stripe customer ID
      await supabaseServiceClient
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", testUser?.id);

      console.log("Created Stripe customer manually: " + customerId);
    }

    console.log("Created User with Stripe Customer ID: " + customerId);
    await createPaymentMethod();
  }, 15_000);

  afterAll(async () => {
    // Clean up Stripe customer
    if (customerId) {
      try {
        await stripe.customers.del(customerId);
        console.log("Deleted Stripe customer: " + customerId);
      } catch (error) {
        console.error("Failed to delete Stripe customer:", error);
      }
    }
    if (testUser) {
      await cleanupTestUser(testUser.id);
    }
  });

  test("subscription updates user to premium", async () => {
    // Set user to "free" tier
    await setUserSubscriptionTier(testUser!.id, "free");

    // Create and complete subscription
    const subscription = await createSubscription();

    // Simulate checkout.session.completed webhook
    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          subscription: subscription.id,
          customer: customerId,
        },
      },
    };
    console.log(`👉 Webhook Event Created: ${event.type}`);

    const response = await sendWebhookEvent(event);
    expect(response.status).toBe(200);

    // Wait for webhook to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify database update
    const { data: profile, error: profileError } = await supabaseServiceClient
      .from("profiles")
      .select()
      .eq("user_id", testUser!.id)
      .single();

    if (profileError) {
      console.error("Profile query error:", profileError);
    }
    expect(profile).toBeTruthy();
    expect(profile?.subscription_plan).toBe("premium");
  }, 30_000);

  test("deleted subscription updates user to free", async () => {
    // Create a subscription
    await setUserSubscriptionTier(testUser!.id, "premium");
    const subscription = await createSubscription();
    console.log(`✅ Created Subscription: ${subscription.id}`);

    // Delete the subscription
    await stripe.subscriptions.cancel(subscription.id);
    console.log(`✅ Cancel Subscription: ${subscription.id}`);

    // Simulate customer.subscription.deleted webhook
    const event = {
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: subscription.id,
          customer: customerId,
        },
      },
    };
    console.log(`👉 Webhook Event Created: ${event.type}`);
    const response = await sendWebhookEvent(event);
    expect(response.status).toBe(200);

    // Wait for webhook to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify database update
    const { data: profile, error: profileError } = await supabaseServiceClient
      .from("profiles")
      .select()
      .eq("user_id", testUser!.id)
      .single();

    if (profileError) {
      console.error("Profile query error:", profileError);
    }
    expect(profile).toBeTruthy();
    expect(profile?.subscription_plan).toBe("free");
    expect(profile?.tasks_limit).toBe(TASK_LIMITS.FREE_TIER);
  }, 30_000);
});