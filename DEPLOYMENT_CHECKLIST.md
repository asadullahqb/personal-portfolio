# Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Variables
- [ ] Set up frontend environment variables in Vercel
- [ ] Set up backend environment variables in Render
- [ ] Add GitHub secrets for CICD

### 2. GitHub Repository
- [ ] Create new GitHub repository
- [ ] Push code to main branch
- [ ] Verify .gitignore excludes build artifacts

### 3. Vercel Setup (Frontend)
- [ ] Connect GitHub repository to Vercel
- [ ] Configure build settings (should auto-detect Next.js)
- [ ] Add environment variable: `NEXT_PUBLIC_BACKEND_URL`
- [ ] Deploy and verify frontend works

### 4. Render Setup (Backend)
- [ ] Connect GitHub repository to Render
- [ ] Use the provided `render.yaml` configuration
- [ ] Add environment variable: `HF_API_KEY`
- [ ] Deploy and verify backend API works

### 5. GitHub Actions CICD
- [ ] Add required GitHub secrets:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
  - `RENDER_API_KEY`
  - `RENDER_SERVICE_ID`
  - `NEXT_PUBLIC_BACKEND_URL`

## Testing Deployment

### 1. Test Welcome Message API
```bash
# Test backend directly
curl -X POST https://your-backend.onrender.com/welcome/ \
  -H "Content-Type: application/json" \
  -d '{"ip": "8.8.8.8"}'
```

### 2. Test Frontend
- Visit your Vercel URL
- Check that welcome message displays correctly
- Verify typewriter animation works

### 3. Test CICD
- Make a small change to main branch
- Push to GitHub
- Verify both Vercel and Render auto-deploy

## Post-Deployment

### 1. Custom Domain (Optional)
- [ ] Set up custom domain for Vercel
- [ ] Configure DNS settings
- [ ] Update environment variables if needed

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
   - Check TypeScript errors
   - Verify environment variables
   - Check build logs in Vercel dashboard

2. **Backend not starting on Render**
   - Check Python dependencies
   - Verify HF_API_KEY is set
   - Check Render service logs

3. **CICD not working**
   - Verify GitHub secrets are correct
   - Check workflow logs in GitHub Actions
   - Ensure branch protection settings allow deployment

4. **Welcome message not translating**
   - Test backend API directly
   - Check Hugging Face API key validity
   - Verify IP detection is working

## Support

If you encounter issues:
1. Check deployment logs on Vercel/Render dashboards
2. Review GitHub Actions workflow logs
3. Test APIs manually using curl or Postman
4. Check environment variable configuration
5. Verify GitHub secrets are correctly set