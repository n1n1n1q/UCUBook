"""
Search bar router
"""

from fastapi import APIRouter
from pydantic import BaseModel
from db.db import DBOperations
from models.search_input import SearchInput


database: DBOperations


search_bar_router = APIRouter()


def set_db(db: DBOperations):
    """
    Set db
    """
    global database
    database = db
    print("search bar db set up: success!")


@search_bar_router.post("/search")
async def search(search_input: SearchInput):
    """
    Search through db function
    """
    input_data = search_input.input_data
    try:
        return [
            i["name"]
            for i in database.get_data("rooms", "all")
            if input_data.lower() in i["name"].lower()
        ]
    except ValueError:
        return []
