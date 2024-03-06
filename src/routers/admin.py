from fastapi import APIRouter
from user import Request
from db.db import DBOperations

router = APIRouter()

@router.put("/requests/")
async def set_request_status(request: Request, status:bool):
    request.status = request