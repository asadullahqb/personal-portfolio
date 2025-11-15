# Deployment Checklist 

## ✅ Current Status: Ready for Deployment

### Domain Configuration
- **Frontend Domain**: `asadullahqamarbhatti.com` (Vercel)
- **Backend**: Render service (URL will be provided by Render)

## Pre-Deployment Setup

### 1. Environment Variables ✅
- [x] Vercel configuration updated for custom domain
- [x] Render configuration optimized with health checks
- [x] Next.js config updated for production optimization

### 2. GitHub Repository ✅
- [x] Monorepo structure already established
- [x] GitHub Actions workflow configured
- [x] Branch protection recommended for `main`

### 3. Required GitHub Secrets (TO CONFIGURE)
Add these to your GitHub repository settings → Secrets and variables → Actions:

**Vercel Deployment:**
- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_ORG_ID` - Your Vercel organization ID  
- `VERCEL_PROJECT_ID` - Your Vercel project ID

**Render Deployment:**
- `RENDER_API_KEY` - Your Render API key
- `RENDER_SERVICE_ID` - Your Render service ID

**Application:**
- `NEXT_PUBLIC_BACKEND_URL` - Your Render backend URL (after first deployment)

### 4. External Service Configuration (TO COMPLETE)

**Vercel Setup:**
1. Connect GitHub repository to Vercel
2. Configure custom domain: `asadullahqamarbhatti.com`
3. Add environment variable: `NEXT_PUBLIC_BACKEND_URL`
4. Deploy frontend

**Render Setup:**
1. Connect GitHub repository to Render
2. Use the provided `render.yaml` configuration
3. Add environment variable: `HF_API_KEY` (Hugging Face API)
4. Deploy backend
5. Update `NEXT_PUBLIC_BACKEND_URL` in GitHub secrets

## Testing Deployment

### 1. Test Welcome Message API
```bash
# Test backend directly (replace with your Render URL)
curl -X POST https://your-backend.onrender.com/welcome/ \
  -H "Content-Type: application/json" \
  -d '{"ip": "8.8.8.8"}'
```

### 2. Test Frontend
- Visit: `https://asadullahqamarbhatti.com`
- Check that welcome message displays correctly
- Verify typewriter animation works

### 3. Test CICD
- Make a small change to main branch
- Push to GitHub
- Verify both Vercel and Render auto-deploy via GitHub Actions

## Post-Deployment ✅

### 1. Custom Domain ✅
- [x] Domain configured: `asadullahqamarbhatti.com`
- [x] Vercel configuration updated
- [x] Next.js optimized for production

### 2. Monitoring
- [ ] Set up Vercel analytics
- [ ] Monitor Render service health
- [ ] Check deployment logs regularly

### 3. Maintenance
- [ ] Keep dependencies updated
- [ ] Monitor API usage (Hugging Face)
- [ ] Review and rotate API keys periodically

## Troubleshooting

### Common Issues

1. **Build fails on Vercel**
   - Check TypeScript errors: `npm run lint` in frontend
   - Verify environment variables are set
   - Check build logs in Vercel dashboard

2. **Backend not starting on Render**
   - Check Python dependencies: `pip install -r requirements.txt`
   - Verify HF_API_KEY is set in Render dashboard
   - Check Render service logs for errors

3. **CICD not working**
   - Verify all GitHub secrets are correctly set
   - Check workflow logs in GitHub Actions tab
   - Ensure branch protection allows deployment from `main`

4. **Welcome message not translating**
   - Test backend API directly with curl
   - Check Hugging Face API key validity
   - Verify IP detection is working

5. **Custom domain not working**
   - Check DNS configuration in Vercel
   - Verify domain ownership
   - Check SSL certificate provisioning

## Quick Commands

```bash
# Local development
npm run dev           # Start both frontend and backend
npm run dev:frontend  # Start only frontend
npm run dev:backend   # Start only backend

# Build and test
npm run build:frontend  # Build frontend
npm run lint           # Run linting (frontend)

# Manual deployment (if needed)
npm run deploy:vercel  # Deploy frontend to Vercel
npm run deploy:render  # Deploy backend to Render
```

## Support

If you encounter issues:
1. Check deployment logs on Vercel/Render dashboards
2. Review GitHub Actions workflow logs
3. Test APIs manually using curl or Postman
4. Verify environment variable configuration
5. Check GitHub secrets are correctly set
6. Ensure custom domain DNS is properly configured

## Next Steps
1. Set up GitHub secrets listed above
2. Configure Vercel and Render services
3. Run first deployment
4. Test the complete application
5. Monitor deployment status