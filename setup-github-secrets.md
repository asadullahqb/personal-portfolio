# GitHub Secrets Setup Guide

## Required Secrets Configuration

Based on the tokens you provided, here are the GitHub secrets you need to set up:

### ✅ Already Provided:
- `VERCEL_TOKEN` = `HWfgAViUUUK8jGPmUOHrATCf`
- `VERCEL_PROJECT_ID` = `prj_ReuXkvfWBsrDxpLqTTFWMeKDWsR4`
- `RENDER_API_KEY` = `rnd_TLFlsjjQ3Inr5VcYVuHQmTl16NMD`

### ⚠️ Still Needed:
1. `VERCEL_ORG_ID` - (Can be empty for personal accounts)
2. `RENDER_SERVICE_ID` - (You mentioned you already set this as a secret)
3. `NEXT_PUBLIC_BACKEND_URL` - (Will be available after first Render deployment)
4. `HF_API_KEY` - (Hugging Face API key for translation feature)

## How to Set Up GitHub Secrets

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Go to **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret with the corresponding name and value

## Getting Missing Secrets

### 1. Hugging Face API Key (HF_API_KEY)
1. Go to https://huggingface.co/settings/tokens
2. Create new token with "Read" access
3. Copy the token and add as `HF_API_KEY`

### 2. Vercel ORG_ID (Optional)
For personal Vercel accounts, this can be left empty. The workflow is configured to handle this.

### 3. NEXT_PUBLIC_BACKEND_URL
This will be your Render backend URL after the first deployment. Format: `https://your-service-name.onrender.com`

## Verification Steps

After setting up secrets:

1. **Test locally first:**
   ```bash
   cd frontend && npm run build
   cd ../backend && python -m pytest tests/ -v
   ```

2. **Trigger deployment:**
   - Push to main branch, or
   - Go to Actions tab → Deploy to Production → Run workflow

3. **Monitor deployment:**
   - Check GitHub Actions logs
   - Check Vercel dashboard for frontend deployment
   - Check Render dashboard for backend deployment

## Current Configuration Status

```
✅ Vercel Configuration: Updated for custom domain
✅ Render Configuration: Enhanced with health checks
✅ GitHub Actions: Updated to handle personal Vercel accounts
✅ Next.js: Optimized for production
⏳ GitHub Secrets: Need to be configured in repository settings
⏳ External Services: Ready for deployment
```

## Next Steps

1. Set up the missing GitHub secrets listed above
2. Push a small change to trigger the workflow
3. Monitor the deployment in GitHub Actions
4. Once deployed, update `NEXT_PUBLIC_BACKEND_URL` with your actual Render URL