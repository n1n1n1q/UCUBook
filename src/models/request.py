from fastapi import FastAPI
from pydantic import BaseModel

class Request(BaseModel):
    room_name: str
    busy_from: int
    busy_to: int
    day: str
    renter: str
    event_name: str
    description: str