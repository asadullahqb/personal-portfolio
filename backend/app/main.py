import os

current_env = os.environ.get('VERCEL_ENV', 'development')

# Load environment variables from a .env file ONLY if running in development mode.
if current_env == 'development':
    # This assumes your local .env file is in the root directory
    from dotenv import load_dotenv
    load_dotenv()
    print("Environment: Local Development. Loaded variables from .env file.")
else:
    # In Vercel (production or preview), the variables are securely injected 
    # via the Vercel dashboard and do not need a .env file.
    print(f"Environment: {current_env.capitalize()}. Using Vercel environment variables.")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, welcome, scribe, model_a

app = FastAPI(title="Multi-Model ML API")

# Configure CORS using a single variable: BACKEND_URL
backend_url = os.environ.get("BACKEND_URL", "http://localhost:8000").lower()
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://asadullahqamarbhatti.com",
    "https://www.asadullahqamarbhatti.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(welcome.router)
app.include_router(scribe.router)
app.include_router(scribe.router_public)
app.include_router(model_a.router)
