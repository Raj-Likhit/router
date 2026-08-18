# Vercel Deployment Guide - OmniRoute AI

**Status:** ✅ Ready for Production Deployment  
**Estimated Time:** 5 minutes  
**Cost:** Free (uses free tier APIs)

---

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Already connected
3. **API Keys:**
   - Gemini API Key (from [Google AI Studio](https://aistudio.google.com))
   - Groq API Key (from [Groq Console](https://console.groq.com))

---

## 🚀 Quick Deployment (5 Steps)

### Step 1: Import Project to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Paste: `https://github.com/Raj-Likhit/router.git`
5. Click **"Import"**

### Step 2: Configure Project Settings

- **Project Name:** `omniroute-ai` (or your preference)
- **Framework Preset:** Other (auto-detected)
- **Root Directory:** `./` (default)
- Click **"Continue"**

### Step 3: Set Environment Variables

Add these in the **Environment Variables** section:

| Variable | Value | Example |
|----------|-------|---------|
| `GEMINI_API_KEY` | Your Gemini API key | `AIza...` |
| `GROQ_API_KEY` | Your Groq API key | `gsk_...` |
| `FLASK_ENV` | `production` | production |
| `CORS_ORIGINS` | Your Vercel domain | `https://omniroute-ai.vercel.app` |

**To find your Vercel domain:**
- After deployment, it will show as `https://omniroute-ai-abc123.vercel.app`
- Update `CORS_ORIGINS` with this exact URL

### Step 4: Deploy

Click **"Deploy"** button.

**Deployment time:** 3-5 minutes

### Step 5: Verify Deployment

Once deployment completes:

1. Click the deployment URL
2. Test the health check:
   ```
   https://your-vercel-url.vercel.app/health
   ```
   Should return: `{"status": "ok"}`

3. Test API endpoint:
   ```bash
   curl -X POST https://your-vercel-url.vercel.app/api/route-complaint \
     -H "Content-Type: application/json" \
     -d '{"complaint": "मेरा पैसा दो बार कट गया है।"}'
   ```

---

## 🔐 Environment Variables in Detail

### GEMINI_API_KEY
- **Source:** [Google AI Studio](https://aistudio.google.com)
- **Steps:**
  1. Go to aistudio.google.com
  2. Click "Get API Key"
  3. Select a project or create new
  4. Copy the API key
  5. Paste in Vercel

### GROQ_API_KEY
- **Source:** [Groq Console](https://console.groq.com)
- **Steps:**
  1. Go to console.groq.com
  2. Sign in/create account
  3. Navigate to API Keys
  4. Create new API key
  5. Copy and paste in Vercel

### CORS_ORIGINS
- **Value:** Your Vercel deployment URL
- **Example:** `https://omniroute-ai.vercel.app`
- **Important:** Must match exact domain for CORS to work

### FLASK_ENV
- **Value:** `production` (for production deployment)
- **Value:** `development` (for testing)

---

## 📊 Deployment Architecture

Vercel will:
1. Deploy backend Python app to serverless function
2. Build and serve frontend React app
3. Route `/api/*` requests to backend
4. Serve static files for frontend
5. Enable automatic HTTPS
6. Provide CDN for global distribution

```
Your Domain
    ↓
Vercel Edge Network
    ↓
┌─────────────────────┐
│ Frontend (React)    │ ← Static files
│ Routed: /*          │
└─────────────────────┘
┌─────────────────────┐
│ Backend (Flask)     │ ← Serverless function
│ Routed: /api/*      │
└─────────────────────┘
```

---

## 🧪 Post-Deployment Testing

### Test 1: Health Check
```bash
curl https://your-vercel-url.vercel.app/health
# Expected: {"status":"ok"}
```

### Test 2: Hindi Billing Complaint
```bash
curl -X POST https://your-vercel-url.vercel.app/api/route-complaint \
  -H "Content-Type: application/json" \
  -d '{"complaint":"मेरा पैसा दो बार कट गया है।"}'

# Expected: Returns ticket with Finance Team routing
```

### Test 3: Frontend
- Open `https://your-vercel-url.vercel.app` in browser
- Click sample complaint buttons
- Verify results display correctly
- Check queue updates

---

## 🚨 Troubleshooting

### Issue: CORS Error
**Symptom:** Browser shows "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution:**
1. Go to Vercel dashboard
2. Select project
3. Settings → Environment Variables
4. Update `CORS_ORIGINS` to match your actual Vercel URL
5. Redeploy

### Issue: API Key Error
**Symptom:** Backend returns "API key not configured"

**Solution:**
1. Verify API keys are set in Vercel environment variables
2. Ensure no extra spaces or line breaks
3. Redeploy after updating

### Issue: 404 on API Endpoint
**Symptom:** `GET /api/route-complaint` returns 404

**Solution:**
1. Verify route is `POST` (not GET)
2. Check request has `Content-Type: application/json`
3. Verify URL matches your Vercel domain

### Issue: Slow Response
**Symptom:** Requests take 5+ seconds

**Solution:**
1. First request is slow due to cold start (normal)
2. Subsequent requests should be 1-2 seconds
3. Monitor Vercel Analytics for performance

### Issue: Frontend 404
**Symptom:** Landing page shows 404

**Solution:**
1. Verify `npm run build` completes in deployment logs
2. Check `frontend/dist` folder exists locally
3. Ensure vite.config.ts has correct `outDir`

---

## 📈 Monitoring & Analytics

### Vercel Dashboard
1. **Deployments** - Track all deploys
2. **Analytics** - View performance metrics
3. **Logs** - See backend errors and requests
4. **Integrations** - Connect monitoring tools

### Useful Commands
```bash
# View deployment logs
vercel logs <project-name>

# View environment variables (local)
vercel env pull

# Redeploy current commit
vercel --prod
```

---

## 🔄 Automatic Deployments

GitHub integration is already set up:
- **Push to main** → Automatic deployment
- **Pull requests** → Preview deployments
- **Rollback** → Click previous deployment in dashboard

---

## 💰 Cost Analysis

### Free Tier Coverage
- **Vercel Hobby (Free):** 100 GB bandwidth/month ✅
- **Gemini API (Free):** 60 requests/minute ✅
- **Groq API (Free):** Generous rate limits ✅

### Estimation for 10,000 Requests/Month
- **API Calls:** ~3,000 (70% dictionary hits)
- **Bandwidth:** ~50 MB
- **Cost:** **$0** (all free tier)

### When to Upgrade
- **Vercel Pro:** If >100 GB bandwidth needed
- **Gemini:** If >60 requests/min consistently
- **Groq:** If >rate limit exceeded

---

## 🎯 Best Practices

### 1. Monitor Errors
- Check Vercel logs daily first week
- Set up error alerts (optional)
- Review failed requests

### 2. Track Performance
- Monitor cold start times
- Track API response times
- Review user traffic patterns

### 3. Update Regularly
- Keep dependencies up-to-date
- Monitor security advisories
- Test before deploying to production

### 4. Scale Gradually
- Start with current setup
- Monitor metrics
- Upgrade if needed based on usage

---

## 📞 Support

### Vercel Issues
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Support: [vercel.com/support](https://vercel.com/support)

### API Issues
- Gemini: [ai.google.dev](https://ai.google.dev)
- Groq: [console.groq.com](https://console.groq.com)

---

## 🎬 Next Steps After Deployment

1. **Configure Custom Domain** (optional)
   - In Vercel project settings
   - Add DNS records
   - Enable auto HTTPS

2. **Set Up Monitoring** (optional)
   - Sentry for error tracking
   - LogRocket for user sessions
   - Datadog for performance

3. **Enable Auto-Scaling** (optional)
   - Already enabled by default
   - Monitor function duration
   - Upgrade if needed

---

## ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] Vercel account set up
- [ ] Project imported to Vercel
- [ ] API keys configured
- [ ] `CORS_ORIGINS` set to Vercel URL
- [ ] Deployment complete (shows "Ready")
- [ ] Health check passes
- [ ] Sample complaint request works
- [ ] Frontend loads correctly
- [ ] Sample buttons trigger API calls

---

## 🎉 Deployment Complete!

Your OmniRoute AI is now live and accessible globally! 🚀

**Status Page:** https://vercel.status.page/  
**Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)  
**Your App:** `https://your-vercel-url.vercel.app`

---

**Congratulations!** Your intelligent multilingual complaint routing system is now in production. 🎊
