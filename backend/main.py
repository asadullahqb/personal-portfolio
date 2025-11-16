import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.routers import health, welcome, scribe, model_a

app = FastAPI(title="Personal Portfolio Backend API")

# Configure CORS using a single variable: BACKEND_URL
backend_url = os.environ.get("BACKEND_URL", "http://localhost:8000").lower()
is_local_backend = ("localhost" in backend_url) or ("127.0.0.1" in backend_url)
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
] if is_local_backend else [
    "https://asadullahqamarbhatti.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(welcome.router)
app.include_router(scribe.router)
app.include_router(model_a.router)

# For Vercel deployment
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
