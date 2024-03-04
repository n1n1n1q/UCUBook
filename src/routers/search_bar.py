"""
Search bar router
"""
from fastapi import APIRouter
from pydantic import BaseModel
from db.db import DBOperations
database: dict
class SearchInput(BaseModel):
    """
    Search input
    """
    input_data: str
router = APIRouter()

def set_db(db: DBOperations):
    """
    Set db
    """
    global database
    database=db
    print(database.get_data("building","all"))

@router.post("/search")
async def search(search_input: SearchInput):
    """
    Search through db function
    """
    input_data = search_input.input_data
    try:
        return [i['name'] for i in database.get_data('rooms','all')
                if input_data.lower() in i['name'].lower()]
    except ValueError:
        return []
