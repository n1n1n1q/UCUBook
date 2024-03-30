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
def create_request(request: Request, user=Depends(Authentication.get_current_user)):
    """Push request to database"""
    input_data = {
        "room_name": request.room_name,
        "busy_from": request.busy_from,
        "busy_to": request.busy_to,
        "day": request.day,
        "renter": user,
        "event_name": request.event_name,
        "description": request.description,
        "status": 0,
    }
    print(
        any(
            (request.busy_from >= int(a[0]) and request.busy_to <= int(a[1]))
            for a in request.available
        )
    )
    if any(
        [
            (request.busy_from >= int(a[0]) and request.busy_to <= int(a[1]))
            for a in request.available
        ]
    ) and input_data["busy_to"] - input_data["busy_from"] in [1, 2, 3]:
        database.add_data("requests", input_data)
        return "Request sent successfully"
    raise ValueError("Invalid time")


@user_router.post("/get_by_data")
def get_possible_requests(input_data: TimeSlotSearchInput):
    """
    Get all possible requests
    """
    date = input_data.input_date
    room = input_data.input_room
    weekday = datetime.strptime(date, "%Y-%m-%d").weekday()
    request_list = database.get_data("requests", date, "day")
    request_list = [i for i in request_list if i["room_name"] == room]
    free_slots = []
    start = 10 if weekday >= 5 else 18
    end = 21
    request_list.sort(key=lambda x: x["busy_from"])
    last_end = start

    for request in request_list:
        busy_from = request["busy_from"]
        busy_to = request["busy_to"]
        if busy_from > last_end:
            free_slots.append((last_end, busy_from))
        last_end = busy_to
    if last_end < end:
        free_slots.append((last_end, end))
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
    user_data = database.get_data("users", current_user)
    return user_data[0]["group"]
