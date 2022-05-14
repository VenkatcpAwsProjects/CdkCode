import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from 'path';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';


export class VenkatInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    var amzQueueExemption = new sqs.Queue(this, 'AmzQueueExemption');

    var producerPath = path.join(__dirname, 'producer-lambda');
    var consumerPath = path.join(__dirname, 'consumer-lambda');

    const amzTable = new dynamodb.Table(this, 'AmzTable', {
      partitionKey: { name: 'appealId', type: dynamodb.AttributeType.STRING },
    });

    var amzProducerLambda = new lambda.Function(this, '', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'lambda2.lambda_handler',
      code: lambda.Code.fromAsset(producerPath),
      timeout : Duration.minutes(3),
      environment : {
        "amz_queue_name": amzQueueExemption.queueName,
      },
    });

    var amzConsumerLambda = new lambda.Function(this, 'AmzConsumerLambda', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'lambda1.lambda_handler',
      code: lambda.Code.fromAsset(consumerPath),
      timeout : Duration.minutes(2),
      environment : {
        "amz_db_name": amzTable.tableName,
      },
    });

    amzQueueExemption.grantSendMessages(amzProducerLambda);
    amzTable.grantReadWriteData(amzConsumerLambda);

    amzConsumerLambda.addEventSource(
      new SqsEventSource(amzQueueExemption, {
        batchSize: 10,
      }),
    );
  }
}
