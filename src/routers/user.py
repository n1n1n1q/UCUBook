"""
Admin router
"""
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


@user_router.get("/requests/{login}")
def get_user_requests(login):
    """
    Get user's requests
    """
    pass
    # code to get all requests sent by the user
