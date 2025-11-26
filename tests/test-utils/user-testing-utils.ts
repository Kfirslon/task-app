import { supabase, supabaseServiceClient } from "./supabase-client";
import { createClient } from "@supabase/supabase-js";

export interface TestUser {
  id?: string;
  name?: string;
  email: string;
  password: string;
}

export async function getOrCreateTestUser(
  userConfig: TestUser
): Promise<TestUser> {
  // Try to sign in first
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: userConfig.email,
      password: userConfig.password,
    });

  if (signInData.user) {
    return {
      id: signInData.user.id,
      email: userConfig.email,
      password: userConfig.password,
    };
  }

  // If user doesn't exist, create it with email confirmation using admin API
  const {
    data: { user },
    error,
  } = await supabaseServiceClient.auth.admin.createUser({
    email: userConfig.email,
    password: userConfig.password,
    email_confirm: true,
    user_metadata: {
      name: userConfig.id,
    },
  });

  if (error) throw error;
  if (!user) throw new Error("User creation failed");

  console.log("Created test user: " + userConfig.email);
  return {
    id: user.id,
    email: userConfig.email,
    password: userConfig.password,
  };
}

export async function cleanupTestUser(userId: string | undefined) {
  if (!userId) return;
  const { error } = await supabaseServiceClient.auth.admin.deleteUser(userId);
  if (error) {
    console.error("Failed to delete test user: " + userId, error);
  } else {
    console.log("Deleted test user: " + userId);
  }
}

export async function createTask(user: TestUser, title: string) {
  const randomString = Math.random().toString(36).substring(2, 14);
  const newTitle = title + "-" + randomString;

  return await supabaseServiceClient
    .from("tasks")
    .insert({
      user_id: user.id,
      title: newTitle,
      description: "Test task",
    })
    .select();
}

export async function getAuthenticatedClient(user: TestUser) {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data, error } = await client.auth.signInWithPassword({
    email: user.email,
    password: user.password,
  });
  
  if (error) {
    console.error("Auth error:", error);
    throw error;
  }
  
  if (!data.session) {
    throw new Error("No session after sign in");
  }
  
  console.log("Authenticated as:", data.user?.id);
  return client;
}