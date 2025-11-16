import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.routers import health, welcome, scribe, model_a, horoscope

app = FastAPI(title="Personal Portfolio Backend API")

# Configure CORS using a single variable: BACKEND_URL
backend_url = os.environ.get("BACKEND_URL", "http://localhost:8000").lower()
env_origins = os.environ.get("ALLOWED_ORIGINS", "").strip()
origins = [o.strip() for o in env_origins.split(",") if o.strip()] or [
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
app.include_router(horoscope.router)

# For Vercel deployment
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
