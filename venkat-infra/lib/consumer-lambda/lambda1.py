import json
import boto3
import time
import os

client = boto3.client('dynamodb')

def lambda_handler(event, context):
    TableName = os.environ.get("amz_appeal_status_table_name")
    for record in event['Records']:
        payload = record["body"]
        message = json.loads(payload)
        client.put_item(TableName=TableName, Item={
        'appealId':{
            'S': message["appealId"]
        },
        'appealDedupId': {
          'S':  message["pt"]+"-"+message["vendorCode"]
        },
        'pt': {
          'S':  message["pt"]
        },
        'vendorCode': {
          'S':  message["vendorCode"]
        },
        'brand': {
          'S': message["brand"]
        }
    })