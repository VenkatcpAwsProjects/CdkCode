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

    // example resource
    // const queue = new sqs.Queue(this, 'VenkatInfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    // var bucket1 = new s3.Bucket(this, 'VenkatFirstS3', {
    //   versioned: true
    // });

    // var bucket2 = new s3.Bucket(this, 'VenkatSecondS3', {
    //   versioned: true
    // });

    var q1 = new sqs.Queue(this, 'VenkatQueue1');
    console.log(q1.queueName);
    var producerPath = path.join(__dirname, 'producer-lambda');
    var consumerPath = path.join(__dirname, 'consumer-lambda');

    const table = new dynamodb.Table(this, 'VenkatExecutionDetails', {
      partitionKey: { name: 'appealId', type: dynamodb.AttributeType.STRING },
    });

    var lambda1 = new lambda.Function(this, 'VenkatFunction1', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'lambda2.lambda_handler',
      code: lambda.Code.fromAsset(producerPath),
      environment : {
        "queue_name": q1.queueName,
      },
    });

    var lambda2 = new lambda.Function(this, 'VenkatFunction2', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'lambda1.lambda_handler',
      code: lambda.Code.fromAsset(consumerPath),
      timeout : Duration.minutes(2),
      environment : {
        "execution_db_name": table.tableName,
      },
    });

    table.grantReadWriteData(lambda2);

    lambda2.addEventSource(
      new SqsEventSource(q1, {
        batchSize: 10,
      }),
    );
  }
}
