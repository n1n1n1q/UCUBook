"""
Search input model
"""

from pydantic import BaseModel


class SearchInput(BaseModel):
    """
    Search input
    """

    input_data: str


class TimeSlotSearchInput(BaseModel):
    """
    Time slot search input
    """

    input_date: str
    input_room: str
