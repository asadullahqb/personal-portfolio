from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Any
from app.services.scribe_service import summarize_note, attribute_dialogue
from app.utils.uploads import init_upload, write_chunk, finalize_upload

router = APIRouter()

class Segment(BaseModel):
    ts: Optional[float] = None
    text: str

class UploadInitResponse(BaseModel):
    uploadId: str

class UploadFinalizeRequest(BaseModel):
    uploadId: str
    filename: Optional[str] = None

class UploadFinalizeResponse(BaseModel):
    fileId: str

class AttributeRequest(BaseModel):
    segments: Optional[List[Segment]] = None
    fileId: Optional[str] = None

class AttributeResponse(BaseModel):
    dialogue: Any
    provider: str

class SummarizeRequest(BaseModel):
    transcript: str = Field(default="")
    dialogue: Optional[str] = None
    audioFileId: Optional[str] = None

class SummarizeResponse(BaseModel):
    note: Any
    provider: str

@router.post("/upload_init", response_model=UploadInitResponse)
def upload_init():
    upload_id = init_upload()
    return {"uploadId": upload_id}

@router.post("/upload_chunk")
async def upload_chunk(request: Request, uploadId: Optional[str] = None, index: Optional[int] = None):
    if not uploadId or index is None:
        raise HTTPException(status_code=400, detail={"error": "Missing uploadId or index"})
    data = await request.body()
    write_chunk(uploadId, index, data)
    return {"ok": True, "index": index}

@router.post("/upload_finalize", response_model=UploadFinalizeResponse)
def upload_finalize(payload: UploadFinalizeRequest):
    if not payload.uploadId:
        raise HTTPException(status_code=400, detail={"error": "Missing uploadId"})
    file_id = finalize_upload(payload.uploadId, payload.filename)
    return {"fileId": file_id}

@router.post("/attribute", response_model=AttributeResponse)
def attribute(payload: AttributeRequest):
    result = attribute_dialogue(segments=payload.segments, audio_file_id=payload.fileId)
    return result

@router.post("/summarize", response_model=SummarizeResponse)
def summarize(payload: SummarizeRequest):
    result = summarize_note(transcript=payload.transcript, dialogue=payload.dialogue, audio_file_id=payload.audioFileId)
    return result