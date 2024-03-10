"""
Search input model
"""
from pydantic import BaseModel


class SearchInput(BaseModel):
    """
    Search input
    """

    input_data: str
