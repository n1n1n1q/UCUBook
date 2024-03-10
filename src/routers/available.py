"""
Available time for booking router
"""
from fastapi import APIRouter
from pydantic import BaseModel
from db.db import DBOperations
database: dict
class RoomAndDateInput(BaseModel):
    """
    Search input
    """
    room: str
    date: str
avaliable_time_router = APIRouter()

def set_db(db: DBOperations):
    """
    Set db
    """
    global database
    database=db
    print("WTF")

