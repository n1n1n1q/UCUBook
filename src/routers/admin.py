from datetime import datetime
from fastapi import APIRouter
from models.request import Request
from db.db import DBOperations

admin_router = APIRouter()
database: DBOperations


def set_db(db: DBOperations):
    """
    Set db
    """
    global database
    database = db
    print("admin db set up: success!")


@admin_router.get
def change_status(status: int, request: Request):
    """
    Change request's status
    """
    input_data = {
        "room_name": request.room_name,
        "busy_from": request.busy_from,
        "busy_to": request.busy_to,
        "day": request.day,
        "renter": request.renter,
    }
    database.update_request_status(input_data, status)


@admin_router.get
def get_all_requests():
    """
    ...
    """
    data = database.get_data("requests", "all")
    filtered_data = list(filter(lambda x: x["status"] != 0, data))
    return list(reversed(filtered_data))
