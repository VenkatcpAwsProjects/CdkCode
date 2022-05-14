import json
import boto3
import time

client = boto3.client('dynamodb')

def lambda_handler(event, context):
    #hi venkat
    for record in event['Records']:
        payload = record["body"]
        message = json.loads(payload)
        time.sleep(20)
        client.put_item(TableName='VenkatQueueResponse', Item={
        'appealId': {
          'S':  message["appealId"]+"-"+message["pt"]+"-"+message["vendorCode"]
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