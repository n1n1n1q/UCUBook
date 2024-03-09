"""
Admin router
"""
from datetime import datetime
from fastapi import APIRouter
from db.db import DBOperations
from models.request import Request

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
    }
    try:
        request.check_data()
        database.add_data("requests", input_data)
        return "Request sent successfully"
    except ValueError as err:
        return f"{err}"


@user_router.get("/requests/get_data")
def get_possible_requests(date: str):
    """
    Get all possible requests
    """
    weekday = datetime.strptime(date, "%d.%m.%y").weekday()
    request_list = database.get_data("requests", date, "day")
    free_slots = []
    start = 10 if weekday >= 5 else 18
    end = 24
    request_list.sort(key=lambda x: x["busy_from"])
    for request in request_list:
        if request["busy_from"] > start:
            free_slots.append((start, request["busy_from"]))
        start = request["busy_to"]
    if start < end:
        free_slots.append((start, end))
    return free_slots


@user_router.get("/requests/{login}")
def get_user_requests(login):
    """
    Get user's requests
    """
    return database.get_data("requests", "renter", login)
