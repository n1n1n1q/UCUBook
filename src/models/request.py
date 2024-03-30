"""
Request model
"""

import re
from datetime import datetime
from pydantic import BaseModel


class Request(BaseModel):
    """
    Request model
    """

    room_name: str
    busy_from: int
    busy_to: int
    day: str
    renter: str
    event_name: str
    description: str
    status: int
    available: list

    def check_data(self):
        if self.busy_from not in range(0, 24) or self.busy_to not in range(0, 24):
            raise ValueError("Time should be between 0 and 23!")
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", self.day):
            raise ValueError("Date should have the format yyyy-mm-dd")
        try:
            datetime.datetime(
                year=int(self.day[:4]), month=int(self.day[5:7]), day=int(self.day[8:])
            )
        except ValueError as exc:
            raise ValueError("Invalid date") from exc


class UpdateRequest(Request):
    new_status: int
