from pydantic import BaseModel

class User(BaseModel):
    login: str
    password: str
    can_rent: bool
    group: int
    display_name: str
