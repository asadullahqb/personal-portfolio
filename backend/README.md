# Personal Portfolio Backend

This is the FastAPI backend for the personal portfolio application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the development server:
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. The API will be available at `http://localhost:8000`

## Deployment

### Render Deployment
This backend is configured for deployment on Render. The `Dockerfile` is set up to build and run the FastAPI application.

### Vercel Deployment (Alternative)
For Vercel deployment, the backend can be deployed as a serverless function using the configuration in `vercel.json`.

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/welcome` - Welcome message endpoint
- `POST /api/welcome` - Welcome message with translation