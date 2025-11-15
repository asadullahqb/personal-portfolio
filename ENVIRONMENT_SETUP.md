# Environment Variables Setup

## Required Environment Variables

### Frontend (Vercel)
- `NEXT_PUBLIC_BACKEND_URL` - URL of your backend API (e.g., https://your-backend.onrender.com)

### Backend (Render)
- `HF_API_KEY` - Hugging Face API key for welcome message translation

## Local Development Setup

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Backend (.env)
```
HF_API_KEY=your_huggingface_api_key_here
```

## Production Setup

### Vercel
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add `NEXT_PUBLIC_BACKEND_URL` with your Render backend URL

### Render
1. Go to your Render dashboard
2. Select your backend service
3. Navigate to "Environment" tab
4. Add `HF_API_KEY` with your Hugging Face API key

## GitHub Secrets (for CICD)

Add these to your GitHub repository secrets:

### Vercel Deployment
- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

### Render Deployment
- `RENDER_API_KEY` - Your Render API key
- `RENDER_SERVICE_ID` - Your Render service ID

### Application Secrets
- `NEXT_PUBLIC_BACKEND_URL` - Your production backend URL

## Getting API Keys

### Hugging Face API Key
1. Sign up at https://huggingface.co
2. Go to Settings → Access Tokens
3. Create a new token with "Read" access

### Vercel API Token
1. Go to https://vercel.com/account/tokens
2. Create a new token

### Render API Key
1. Go to https://render.com
2. Account Settings → API Keys
3. Create a new key

## Security Notes
- Never commit `.env` files to version control
- Use different API keys for development and production
- Rotate keys regularly
- Use GitHub Secrets for CICD deployments