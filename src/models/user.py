from pydantic import BaseModel

class User(BaseModel):
    name: str
    surname: str | None = None
    email: str | None = None
    occupation: str | None = None
