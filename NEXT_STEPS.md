# Next Steps - Quick Guide

## ✅ What You've Done So Far:
- Set Stripe webhook secret ✅
- Created task-images bucket (needs to be deleted - see below)

## 🚨 IMPORTANT: Storage Bucket Fix

Your migration creates a bucket called `task-attachments`, but you created `task-images`.

**Fix this:**
1. Go to Supabase Dashboard → Storage → Buckets
2. Delete the `task-images` bucket you just created
3. The migration will create `task-attachments` with all policies automatically

## 📝 Remaining Steps (In Order):

### Step 1: Fix .env.local (if not done yet)
Check that `.env.local` has ONLY 2 lines (no comments).

### Step 2: Push Database Migrations
This will create the `task-attachments` bucket with all policies:
```bash
npx supabase db push
```

### Step 3: Deploy Edge Functions
```bash
npx supabase functions deploy create-task-with-ai
npx supabase functions deploy create-stripe-session
npx supabase functions deploy stripe-webhook
```

### Step 4: Disable JWT for stripe-webhook
1. Supabase Dashboard → Edge Functions → stripe-webhook
2. Details tab → Disable "Enforce JWT verification"
3. Save

### Step 5: Update Stripe Webhook URL
1. Stripe Dashboard → Developers → Webhooks
2. Update endpoint URL to:
   ```
   https://wapivfbxcenjnysmzawn.supabase.co/functions/v1/stripe-webhook
   ```
3. Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted

### Step 6: Test Stripe Webhook (Optional but Recommended)
1. In Stripe Dashboard, click "Send test webhook"
2. Select `checkout.session.completed`
3. Send it
4. Check Supabase Edge Functions → stripe-webhook → Logs

### Step 7: Configure Google OAuth
1. Supabase Dashboard → Authentication → Providers → Google
2. Enable and add your Client ID and Secret

### Step 8: Test the App
```bash
npm run dev
```
Visit: http://localhost:3001

---

## 🔍 Quick Verification Commands

```bash
# Check if migrations are ready
npx supabase db push --dry-run

# Check deployed functions
npx supabase functions list

# Check secrets
npx supabase secrets list
```

---

## ⏱️ Time Estimate
- Steps 1-3: ~5 minutes
- Steps 4-7: ~10 minutes  
- Step 8: ~2 minutes
**Total: ~15-20 minutes**
