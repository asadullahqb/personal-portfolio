# Personal Portfolio - Full Stack Application

A modern personal portfolio website with AI-powered welcome messages, built with Next.js frontend and FastAPI backend.

## 🚀 Features

- **AI-Powered Welcome Messages**: Automatically detects user location and displays welcome messages in their local language
- **Modern Frontend**: Built with Next.js 15, React 19, TypeScript, and Tailwind CSS
- **FastAPI Backend**: High-performance Python backend with ML capabilities
- **Responsive Design**: Mobile-first, fully responsive design
- **Typewriter Animation**: Smooth typewriter effect for welcome messages
- **Monorepo Structure**: Clean separation of frontend and backend code

## 📁 Project Structure

```
personal-portfolio/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js App Router pages
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/          # FastAPI backend application
│   ├── app/          # FastAPI application code
│   ├── requirements.txt # Python dependencies
│   └── render.yaml   # Render deployment config
├── .github/          # GitHub Actions workflows
└── package.json      # Root package.json with scripts
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Geist Font** - Modern typography

### Backend
- **FastAPI** - Modern Python web framework
- **Hugging Face API** - AI-powered welcome messages
- **Uvicorn** - ASGI server
- **Python 3.11** - Latest Python version

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **GitHub Actions** - CICD pipeline

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/personal-portfolio.git
cd personal-portfolio
```

### 2. Environment Setup

#### Frontend Environment
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your backend URL
```

#### Backend Environment
```bash
cd ../backend
cp .env.example .env
# Edit .env with your Hugging Face API key
```

See [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) for detailed environment setup instructions.

### 3. Install Dependencies

#### Install all dependencies (root level)
```bash
cd ..
npm run install:all
```

#### Or install separately:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
pip install -r requirements.txt
```

### 4. Development

#### Run both frontend and backend
```bash
npm run dev
```

#### Run frontend only
```bash
npm run dev:frontend
```

#### Run backend only
```bash
npm run dev:backend
```

### 5. Production Build

#### Build frontend
```bash
npm run build:frontend
```

## 🌍 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Backend (.env)
```
HF_API_KEY=your_huggingface_api_key_here
```

## 🚀 Deployment

### Automatic Deployment (Recommended)

The repository includes GitHub Actions CICD that automatically deploys to production when you push to the `main` branch.

#### Setup Steps:

1. **Connect to GitHub**
   - Push your code to GitHub
   - Create a new repository

2. **Connect Vercel to GitHub**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

3. **Connect Render to GitHub**
   - Go to [Render](https://render.com)
   - Create new web service from GitHub
   - Use the `render.yaml` configuration

4. **Set up GitHub Secrets**
   - Go to your GitHub repository Settings → Secrets → Actions
   - Add the required secrets (see below)

#### Required GitHub Secrets:

```
# Vercel
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id  
VERCEL_PROJECT_ID=your_vercel_project_id

# Render
RENDER_API_KEY=your_render_api_key
RENDER_SERVICE_ID=your_render_service_id

# Application
NEXT_PUBLIC_BACKEND_URL=your_backend_url
```

### Manual Deployment

#### Deploy Frontend to Vercel
```bash
npm run deploy:vercel
```

#### Deploy Backend to Render
```bash
npm run deploy:render
```

## 🔧 Configuration Files

### Vercel Configuration (vercel.json)
- Configures frontend deployment
- Routes API calls to backend
- Environment variable mapping

### Render Configuration (backend/render.yaml)
- Configures backend deployment
- Python environment setup
- Build and start commands

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/ -v
```

### Frontend Development Test
```bash
cd frontend
npm run dev
```

## 📝 API Documentation

### Welcome Message Endpoint
```http
POST /welcome/
Content-Type: application/json

{
  "ip": "user_ip_address"
}
```

Response:
```json
{
  "message": "Welcome!",
  "language": "en",
  "country_code": "US",
  "ip_used": "user_ip_address",
  "source": "ai"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

1. **Build fails on Vercel**
   - Check environment variables
   - Verify TypeScript compilation
   - Check for missing dependencies

2. **Backend not responding**
   - Verify HF_API_KEY is set
   - Check Render service logs
   - Ensure Python dependencies are installed

3. **Welcome message not translating**
   - Check Hugging Face API key validity
   - Verify backend is running
   - Check browser console for errors

## 📞 Support

For issues and questions:
- Check the [troubleshooting guide](ENVIRONMENT_SETUP.md)
- Open an issue on GitHub
- Review deployment logs on Vercel/Render dashboards

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Hugging Face for AI translation API
- Vercel for frontend hosting
- Render for backend hosting
- Next.js team for the amazing framework