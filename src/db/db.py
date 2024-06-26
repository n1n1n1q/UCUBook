"""
DB module
"""

import os
from google.cloud import bigquery


class DBOperations:
    """
    Db operations class
    """

    def set_up(self):
        """
        Set up the database
        """
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = (
            "src/db/magnetic-nimbus-414610-2bcd9c115d01.json"
        )
        self.client = bigquery.Client()
        self.proj_id = self.client.project
        self.data_id = "ucubook"
        self.dataset = bigquery.Dataset(f"{self.client.project}.{self.data_id}")
        self.dataset.location = "EU"

    def get_data(self, datatype, name, attr=None):
        """
        Get data from the database
        datatype - <users, building, rooms, requests>
        name - column's name, 'all' - to get all data
        attr - search for specific column name
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
            table = self.client.get_table(self.dataset.table(table_id))
            if not any(i.name == attr for i in table.schema):
                raise ValueError(f"No {attr} in {datatype}")
            _name = attr
        sql_query = (
            f"""
        SELECT *
        FROM `{self.proj_id}.{self.data_id}.{table_id}`
        WHERE {_name} = {"'"+name+"'" if not name.isnumeric() else name}
    """
            if name != "all"
            else f"SELECT * FROM `{self.proj_id}.{self.data_id}.{table_id}`"
        )
        query_job = self.client.query(sql_query)
        row_data = [dict(row.items()) for row in query_job]
        if len(row_data) == 0 and datatype != "requests":
            raise ValueError(f"{datatype} {name} not found")
        return row_data

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
                    data,
                    [
                        "room_name",
                        "renter",
                        "busy_from",
                        "busy_to",
                        "day",
                        "event_name",
                        "description",
                        "status",
                    ],
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
                    raise ValueError(f"{datatype} {i[_name]} already exists")
        elif not self.is_valid_request(data):
            raise ValueError("Request is not valid")
        table_id = self.data_id + "." + table_id
        errors = self.client.insert_rows_json(
            table_id, data if isinstance(data, list) else [data]
        )
        if not errors:
            print("New rows have been added.")
        else:
            print(f"Encountered errors while inserting rows: {errors}")

    def is_valid_request(self, data):
        """
        Checks whether the request is valid
        """
        query = f"""SELECT *
FROM `{self.proj_id}.{self.data_id}.requests`
WHERE room_name = '{data["room_name"]}' 
  AND day = '{data["day"]}'
  AND renter = '{data["renter"]}' 
  AND busy_from <= {data["busy_from"]}
  AND busy_to >= {data["busy_to"]};
"""
        return not [dict(row.items()) for row in self.client.query(query)]

    def update_request_status(self, request, new_status):
        """
        Update request's status
        """
        if not DBOperations.check_input(
            request,
            [
                "room_name",
                "renter",
                "busy_from",
                "busy_to",
                "day",
                "event_name",
                "description",
                "status",
            ],
        ):
            raise ValueError("Invalid input data")
        request_list = self.get_data("requests", "all")
        if request not in request_list:
            raise ValueError("Invalid input data")
        query = f"""UPDATE `{self.proj_id}.{self.data_id}.requests`
SET status = {new_status}
WHERE room_name = '{request["room_name"]}' 
  AND day = '{request["day"]}'
  AND renter = '{request["renter"]}' 
  AND busy_from = {request["busy_from"]}
  AND busy_to = {request["busy_to"]};
"""
        query_job = self.client.query(query)
        query_job.result()


if __name__ == "__main__":

    def delete_data(MyDB, table):
        query = f"""DELETE FROM `{MyDB.proj_id}.{MyDB.data_id}.{table}` WHERE 1=1"""
        query_job = curr_client.query(query)
        query_job.result()

    MyDB = DBOperations()
    MyDB.set_up()
    curr_client = bigquery.Client()
    # delete_data(MyDB, "requests")
    print("Finished!")

    import hashlib

    def hash_password(password):
        password_bytes = password.encode("utf-8")
        hashed_bytes = hashlib.sha256(password_bytes).digest()
        hashed_password = hashlib.sha256(password_bytes).hexdigest()
        return hashed_password

    MyDB.add_data(
        "users",
        {
            "login": "user",
            "password": f"{hash_password('password')}",
            "can_rent": True,
            "group": 1,
            "display_name": "Ucubook Admin",
        },
    )
