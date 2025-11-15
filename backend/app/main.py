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

# Add CORS middleware directly after creating the app instance
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(welcome.router)
app.include_router(scribe.router)
app.include_router(model_a.router)
