from pydantic import BaseModel

class Admin(BaseModel):
    name: str
    surname: str | None = None
    email: str | None = None
    occupation: str