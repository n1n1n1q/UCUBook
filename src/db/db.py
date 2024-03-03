"""
DB module
"""
import os
from google.cloud import bigquery

class DBOperations:
    """
    Db operations class
    """
    def __init__(self):
        """
        Set up the database
        """
        os.environ[
        "GOOGLE_APPLICATION_CREDENTIALS"
        ] = "src/db/magnetic-nimbus-414610-2bcd9c115d01.json"
        self.client = bigquery.Client()
        self.proj_id = self.client.project
        self.data_id = "ucubook"
        self.dataset = bigquery.Dataset(f"{self.client.project}.{self.data_id}")
        self.dataset.location = "EU"
    def get_data(self, datatype, name, attr=None):
        """
        Get data from the database
        """
        if not isinstance(name, str):
            raise ValueError("Invalid input data")
        _name = ""
        match datatype:
            case "users":
                table_id = "users"
                _name = "login"
            case "building":
                table_id = "building"
                _name = "name"
            case "rooms":
                table_id = "rooms"
                _name = "name"
            case "requests":
                table_id = "requests"
                _name = "room_name"
            case _:
                raise ValueError(f"Invalid data type {datatype}")
        if attr:
            table=self.client.get_table(self.dataset.table(table_id))
            if not any(i.name==attr for i in table.schema):
                raise ValueError(f"No {attr} in {datatype}")
            _name=attr
        sql_query = f"""
        SELECT *
        FROM `{self.proj_id}.{self.data_id}.{table_id}`
        WHERE {_name} = '{name}'
    """
        query_job = self.client.query(sql_query)
        row_data = [dict(row.items()) for row in query_job]
        if len(row_data) == 0 and datatype != "requests":
            raise ValueError(f"{datatype} {name} not found")
        return row_data[0] if len(row_data) == 1 else row_data
    @staticmethod
    def check_input(input_data, expected_keys):
        """
        Check if input data has all expected keys
        """
        return (
            all(set(i) == set(expected_keys) for i in input_data)
            if isinstance(input_data, list)
            else set(input_data.keys()) == set(expected_keys)
        )

    def add_data(self, datatype, data):
        """
        Add data to the database
        """
        if (
            isinstance(data, list) and all(isinstance(i, dict) for i in data)
        ) or isinstance(data, dict):
            _name = ""
        else:
            raise ValueError("Invalid input data")
        match datatype:
            case "users":
                table_id = "users"
                _name = "login"
                if not DBOperations.check_input(
                    data, ["login", "password", "can_rent", "group", "display_name"]
                ):
                    raise ValueError("Invalid input data")
            case "building":
                _name = "name"
                table_id = "building"
                if not DBOperations.check_input(data, ["name", "floors"]):
                    raise ValueError("Invalid input data")
            case "rooms":
                _name = "name"
                table_id = "rooms"
                if not DBOperations.check_input(data, ["name", "capacity"]):
                    raise ValueError("Invalid input data")
            case "requests":
                _name = "room_name"
                table_id = "requests"
                if not DBOperations.check_input(
                    data, ["room_name", "renter", "busy_from", "busy_to", "day",
                            "event_name", "description"]
                ):
                    raise ValueError("Invalid input data")
            case _:
                raise ValueError(f"Invalid data type {datatype}")
        if datatype in ["building", "rooms", "users"]:
            for i in [data] if isinstance(data, dict) else data:
                try:
                    self.get_data(datatype, i[_name])
                except ValueError:
                    pass
                else:
                    raise FileExistsError(f"{datatype} {i[_name]} already exists")
        table_id = self.data_id + "." + table_id
        errors = self.client.insert_rows_json(
            table_id, data if isinstance(data, list) else [data]
        )
        if not errors:
            print("New rows have been added.")
        else:
            print(f"Encountered errors while inserting rows: {errors}")


if __name__ == "__main__":
    data = [
        {"name": "ЦШ", "floors": 6},
        {"name": "АК", "floors": 5},
        {"name": "ХС", "floors": 2},
    ]
    MyDb=DBOperations()
    print(MyDb.get_data("building", "ХС"))
    print(MyDb.get_data("users", "admin"))
    print(MyDb.get_data("building", "5", "floors"))
