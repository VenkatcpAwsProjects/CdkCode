import json
import boto3
import time
import os

client = boto3.client('dynamodb')

def lambda_handler(event, context):
    TableName = os.environ.get("amz_db_name")
    print(event)
    appealId = event["queryStringParameters"]["appealId"]
    records_processed = 12
    total_records = 200
    ans = {
        'appealId' : appealId,
        'totalRecords' : total_records,
        'recordsProcessed' : records_processed
    }
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "*/*"
        },
        "body" : json.dumps(ans)
    }