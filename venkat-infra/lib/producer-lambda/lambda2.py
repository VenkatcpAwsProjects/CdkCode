import json
import logging
import boto3
from botocore.exceptions import ClientError
import os

def send_sqs_message(QueueName, msg_body):
    sqs_client = boto3.client('sqs')
    sqs_queue_url = sqs_client.get_queue_url(
    QueueName=QueueName
)['QueueUrl']
    try:
        msg = sqs_client.send_message(QueueUrl=sqs_queue_url,
                                      MessageBody=json.dumps(msg_body))
    except ClientError as e:
        logging.error(e)
        return None
    return msg

def create_entry_in_db(event):
    total = len(event["pts"]) * len(event["vendorCodes"])
    db_client = boto3.client('dynamodb')
    TableName = os.environ.get("amz_appeal_table_name")
    db_client.put_item(TableName=TableName, Item={
        'appealId':{
            'S': event["appealId"]
        },
        'totalCount': {
            'N': str(total)
        }
    })
    pass

def lambda_handler(event, context):
    QueueName = os.environ.get("amz_queue_name")
    # amz_appeal_table_name
    # Set up logging
    logging.basicConfig(level=logging.DEBUG,
                        format='%(levelname)s: %(asctime)s: %(message)s')
    vendorCodes = event["vendorCodes"]
    brand = event["brand"]
    appealid = event["appealId"]
    pts = event["pts"]

    # create entry in AmzAppealTable
    create_entry_in_db(event)

    # Send some SQS messages
    for  vendorCode in vendorCodes:
        for pt in pts:
            message = {"pt":pt,"vendorCode":vendorCode, "brand":brand, "appealId" : appealid}
            msg = send_sqs_message(QueueName, message)
    #msg = send_sqs_message(QueueName,event)
    if msg is not None:
        logging.info(f'Sent SQS message ID: {msg["MessageId"]}')
    return {
        'statusCode': 200,
        'body': json.dumps(event)
    }