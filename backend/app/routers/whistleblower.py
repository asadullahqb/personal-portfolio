from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
from app.services.whistleblower_service import run_investigation

router = APIRouter(prefix="/api/whistleblower", tags=["Whistleblower"])

class InvestigationRequest(BaseModel):
    target_type: str = Field(default="individual")
    name: str
    organisation: Optional[str] = None
    timeframe: Optional[str] = None
    context: Optional[str] = None

class SourceItem(BaseModel):
    url: str
    snippet: str
    credibility_score: float

class InvestigationResponse(BaseModel):
    verdict: str
    comments: str
    sources: List[SourceItem]
    risk_score: float
    flags: Dict[str, Any]

@router.post("/analyze", response_model=InvestigationResponse)
def analyze(req: InvestigationRequest) -> InvestigationResponse:
    out = run_investigation(req.target_type, req.name, req.organisation, req.timeframe, req.context)
    if "error" in out:
        raise HTTPException(status_code=400, detail=out["error"]) 
    return InvestigationResponse(**out)