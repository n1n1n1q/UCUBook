"""
DB module
"""
import os
from google.cloud import bigquery
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "src/db/magnetic-nimbus-414610-2bcd9c115d01.json"
client = bigquery.Client()
proj_id = client.project
data_id = 'ucubook'
dataset=bigquery.Dataset(f"{client.project}.{data_id}")
dataset.location="EU"

def get_data(datatype, name):
    """
    Get data from the database
    """
    _name=""
    match datatype:
        case "users":
            table_id="users"
            _name="login"
        case "building":
            table_id="building"
            _name="name"
        case "rooms":
            table_id="rooms"
            _name="name"
        case "requests":
            table_id="requests"
            _name="room_name"
        case _:
            raise ValueError(f"Invalid data type {datatype}")
    sql_query = f"""
    SELECT *
    FROM `{proj_id}.{data_id}.{table_id}`
    WHERE {_name} = '{name}'
"""
    query_job=client.query(sql_query)
    row_data=[dict(row.items()) for row in query_job]
    if len(row_data)==0 and datatype!="requests":
        raise ValueError(f"{datatype} {name} not found")
    if len(row_data)>1 and datatype!="requests":
        raise ValueError(f"Multiple {datatype} with name {name} found")
    return row_data[0] if len(row_data)==1 else row_data

def add_data(datatype, data):
    """
    Add data to the database
    """
    if not isinstance(data, dict):
        raise ValueError("Invalid input data")
    match datatype:
        case "users":
            table_id="users"
            if set(data.keys())!=set(["login","password","can_rent","group"]):
                raise ValueError("Invalid input data")
        case "building":
            table_id="building"
            if set(data.keys())!=set(["name","floors"]):
                raise ValueError("Invalid input data")
        case "rooms":
            table_id="rooms"
            if set(data.keys())!=set(["name","capacity","is_free"]):
                raise ValueError("Invalid input data")
        case "requests":
            table_id="requests"
            if set(data.keys())!=set(["room_name","renter","busy_from","busy_to","day"]):
                raise ValueError("Invalid input data")
        case _:
            raise ValueError(f"Invalid data type {datatype}")
    table_id=data_id+"."+table_id
    errors = client.insert_rows_json(table_id, data)
    if not errors:
        print("New rows have been added.")
    else:
        print(f"Encountered errors while inserting rows: {errors}")

if __name__=='__main__':
    data=[
        {"name":"ЦШ", "floors":5},
        {"name":"БФК", "floors":5},
        {"name":"ХС", "floors": 5}
    ]

    print(get_data("building","ЦШ"))
