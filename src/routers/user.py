"""
Admin router
"""
from datetime import datetime
from fastapi import APIRouter, Depends
from db.db import DBOperations
from dependencies.auth import Authentication
from models.request import Request
from models.search_input import SearchInput, TimeSlotSearchInput

user_router = APIRouter()

database: DBOperations


def set_db(db: DBOperations):
    """
    Set db
    """
    global database
    database = db
    print("user db set up: success!")


@user_router.post("/requests/")
def create_request(request: Request):
    """Push request to database"""
    input_data = {
        "room_name": request.room_name,
        "busy_from": request.busy_from,
        "busy_to": request.busy_to,
        "day": request.day,
        "renter": request.renter,
        "event_name": request.event_name,
        "description": request.description
    }
    try:
        request.check_data()
        database.add_data("requests", input_data)
        return "Request sent successfully"
    except ValueError as err:
        return f"{err}"

@user_router.post("/get_by_data")
def get_possible_requests(input_data:TimeSlotSearchInput):
    """
    Get all possible requests
    """
    date=input_data.input_date
    room=input_data.input_room
    weekday = datetime.strptime(date, "%Y-%m-%d").weekday()
    request_list = database.get_data("requests", date, "day")
    request_list = [i for i in request_list if i['room_name']==room]
    free_slots = []
    start = 10 if weekday >= 5 else 18
    end = 21
    request_list.sort(key=lambda x: x["busy_from"])
    for request in request_list:
        if request["busy_from"] > start:
            free_slots.append((start, request["busy_from"]))
            start = request["busy_to"]
    if start < end:
        free_slots.append((start, end))
    return free_slots


@user_router.get("/requests/{login}")
def get_user_requests(login: str = Depends(Authentication.get_current_user)):
    """
    Get user's requests
    """
    return database.get_data("requests", login, "renter")

@user_router.get("/user_status")
def get_user_status(current_user: str = Depends(Authentication.get_current_user)):
    """
    Get user's status
    """
    user_data=database.get_data("users", current_user)
    return user_data[0]["group"]
