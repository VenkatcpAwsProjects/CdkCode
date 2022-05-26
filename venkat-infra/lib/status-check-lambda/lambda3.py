import json
import boto3
import time
import os

client = boto3.client('dynamodb')

def get_total_count(appealId):
    TableName = os.environ.get("amz_appeal_table_name")
    db_client = boto3.client('dynamodb')
    total_count = db_client.get_item(
        TableName=TableName,
        Key={
            'appealId': { 'S' : str(appealId)}
        }
    )
    return int(total_count["Item"]["totalCount"]["N"])

def get_records_processed(appealId):
    TableName = os.environ.get("amz_appeal_status_table_name")
    db_client = boto3.client('dynamodb')
    records = db_client.query(
        TableName=TableName,
        KeyConditionExpression = "appealId = :v1",
        ExpressionAttributeValues={
            ':v1': { 'S' : str(appealId)}
        }
    )
    return records["ScannedCount"]

def lambda_handler(event, context):
    appealId = event["queryStringParameters"]["appealId"]
    records_processed = get_records_processed(appealId)
    total_records = get_total_count(appealId)
    print(total_records)
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