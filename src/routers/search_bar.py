from fastapi import APIRouter
from db.db import DBOperations
from pydantic import BaseModel

class SearchInput(BaseModel):
    input_data: str
router = APIRouter()

def set_db(db: DBOperations):
    global database
    database=db
    print(database.get_data("building","all"))

@router.post("/search")
async def search(search_input: SearchInput):
    input_data = search_input.input_data
    print("SEARCH")
    try:
        return [i['name'] for i in database.get_data('rooms','all')
                if input_data.lower() in i['name'].lower()]
    except ValueError:
        return []
