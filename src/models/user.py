"""
User model
"""

from pydantic import BaseModel


class User(BaseModel):
    """
    User model
    """

    login: str
    password: str
    can_rent: bool
    group: int
    display_name: str
