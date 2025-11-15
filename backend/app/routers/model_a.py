from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/model-a", tags=["Model A"])

class PredictInput(BaseModel):
    features: List[float]

class PredictOutput(BaseModel):
    prediction: float

@router.post("/predict", response_model=PredictOutput)
def predict(payload: PredictInput):
    s = sum(payload.features) if payload.features else 0.0
    return {"prediction": s}