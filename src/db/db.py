import os
from google.cloud import bigquery
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "src/db/magnetic-nimbus-414610-2bcd9c115d01.json"
client=bigquery.Client()
dataset_id = 'my_dataset'
dataset=bigquery.Dataset(f"{client.project}.{dataset_id}")
dataset.location="EU"
dataset=client.create_dataset(dataset)


def get_user():
    pass
def get_building():
    pass
def get_room():
    pass