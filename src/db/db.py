import os
from google.cloud import bigquery
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "src/db/magnetic-nimbus-414610-2bcd9c115d01.json"
client = bigquery.Client()
project_id = client.project
dataset_id = 'ucubook'
dataset=bigquery.Dataset(f"{client.project}.{dataset_id}")
dataset.location="EU"

def get_building(building,project_id=project_id,dataset_id=dataset_id,table_id="building"):
    sql_query = f"""
    SELECT *
    FROM `{project_id}.{dataset_id}.{table_id}`
    WHERE name = '{building}'
"""
    query_job = client.query(sql_query)
    row_data=[dict(row.items()) for row in query_job]
    if len(row_data)==0:
        raise ValueError(f"Building {building} not found")
    if len(row_data)>1:
        raise ValueError(f"Multiple buildings with name {building} found")
    return row_data[0]

def get_room(room,project_id=project_id,dataset_id=dataset_id,table_id="rooms"):
    sql_query = f"""
    SELECT *
    FROM `{project_id}.{dataset_id}.{table_id}`
    WHERE name = '{room}'
"""
    query_job = client.query(sql_query)
    row_data=[dict(row.items()) for row in query_job]
    if len(row_data)==0:
        raise ValueError(f"Room {room} not found")
    if len(row_data)>1:
        raise ValueError(f"Multiple rooms with name {room} found")
    return row_data[0]

def get_user(user,project_id=project_id,dataset_id=dataset_id,table_id="users"):
    sql_query = f"""
    SELECT *
    FROM `{project_id}.{dataset_id}.{table_id}`
    WHERE name = '{user}'
"""
    query_job = client.query(sql_query)
    row_data=[dict(row.items()) for row in query_job]
    if len(row_data)==0:
        raise ValueError(f"User {user} not found")
    if len(row_data)>1:
        raise ValueError(f"Multiple users with name {user} found")
    return row_data[0]
    
def add_user(table,data,dataset_id=dataset_id):
    table_id=dataset_id+"."+table
    errors = client.insert_rows_json(table_id, data)
    if errors == []:
        print("New rows have been added.")
    else:
        print("Encountered errors while inserting rows: {}".format(errors))
    

def data_init(table,data,dataset_id=dataset_id):
    table_id=dataset_id+"."+table
    errors = client.insert_rows_json(table_id, data)
    if errors == []:
        print("New rows have been added.")
    else:
        print("Encountered errors while inserting rows: {}".format(errors))
data=[
    {"name":"ЦШ", "floors":5},
    {"name":"БФК", "floors":5},
    {"name":"ХС", "floors": 5}
]
print(get_building("ЦШ"))