from datetime import datetime
from fastapi import APIRouter
from models.request import Request, UpdateRequest
from db.db import DBOperations
from dependencies.auth import Message

admin_router = APIRouter()
database: DBOperations


def set_db(db: DBOperations):
    """
    Set db
    """
    global database
    database = db
    print("admin db set up: success!")


@admin_router.post("/update_request_status")
def change_status(request: UpdateRequest):
    """
    Change request's status
    """
    input_data = {
        "room_name": request.room_name,
        "busy_from": request.busy_from,
        "busy_to": request.busy_to,
        "day": request.day,
        "renter": request.renter,
        "event_name": request.event_name,
        "description": request.description,
        "status": request.status,
    }
    database.update_request_status(input_data, request.new_status)
    print(request.new_status)
    if request.renter.endswith("@ucu.edu.ua") and request.new_status == 1:
        Message.send_invitation(
            request.renter,
            f"Бронювання {request.room_name}",
            "Підтвердження бронювання авдиторії",
            request.day,
            f"{request.busy_from}:00",
            f"{request.busy_to}:00",
        )


@admin_router.get("/get_past_requests")
def get_all_requests():
    """
    ...
    """
    data = database.get_data("requests", "all")
    filtered_data = sorted(
        list(filter(lambda x: x["status"] != 0, data)),
        key=lambda x: (datetime.strptime(x["day"], "%Y-%m-%d"), x["busy_from"]),
    )

    return list(reversed(filtered_data))


@admin_router.get("/get_pending_requests")
def get_pending():
    """ """
    data = sorted(
        database.get_data("requests", "0", "status"),
        key=lambda x: (datetime.strptime(x["day"], "%Y-%m-%d"), x["busy_from"]),
    )
    return data
