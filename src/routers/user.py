"""

"""
from pydantic import BaseModel
from fastapi import APIRouter
from src.main import app
from db.db import DBOperations
from main import database
import re
import datetime
user_router=APIRouter()

# @user_router.post("/getuser")
# async def get_current_user():
#     return

# треба поміняти
class Request(BaseModel):
    '''
    Represents a booking request
    '''
    room_name: str
    busy_from: str
    busy_to: str
    day: str
    renter: str
    event_name: str
    description: str
    # status: bool | None = 0
    def check_data(self):
        if self.busy_from not in range(0, 24) or self.busy_to not in range(0,24):
            raise ValueError('Time should be between 0 and 23!')
        if not re.match(r'^\d{4}.\d{2}.\d{2}$', self.day):
            raise ValueError('Date should have the format yyyy.mm.dd')
        try:
            datetime.datetime(year=int(self.day[:4]),month=int(self.day[5:7]), day=int(self.day[8:]))
        except ValueError:
            raise ValueError('Invalid date')

@user_router.post("/requests/") 
def create_request(request: Request): 
    """Push request to database""" 
    input_data = {'room_name':request.room_name, 
                'busy_from':request.busy_from,'busy_to':request.busy_to, 
                'day':request.day,'renter':request.renter} 
    try: 
        request.check_data()
        database.add_data('requests', input_data)
        return "Request sent successfully"
    except ValueError as err: 
        return err.message

@user_router.get("/requests/{login}")
def get_user_requests(login):
    ....
    # code to get all requests sent by the user

app.include_router(user_router)