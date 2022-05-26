
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from 'path';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { AccountPrincipal, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Constants } from './constants';

export class VenkatInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // The code that defines your stack goes here

    var amzSQSQueue = new sqs.Queue(this, Constants.AmzSQSQueue, 
    {
       queueName: Constants.AmzSQSQueue,
       "visibilityTimeout" : Duration.minutes(3)
    });

    var producerPath = path.join(__dirname, Constants.producerLambda);
    var consumerPath = path.join(__dirname, Constants.consumerLambda);
    var statusCheckPath = path.join(__dirname, Constants.statusCheckLambda);

    const amzAppealStatusTable = new dynamodb.Table(this, Constants.AmzAppealStatusTable, {
      tableName: Constants.AmzAppealStatusTable,
      partitionKey: { name: Constants.appealId, type: dynamodb.AttributeType.STRING },
      sortKey: { name: Constants.appealDedupId, type: dynamodb.AttributeType.STRING }
    });

    const amzAppealTable = new dynamodb.Table(this, Constants.AmzAppealTable, {
      tableName: Constants.AmzAppealTable,
      partitionKey: { name: Constants.appealId, type: dynamodb.AttributeType.STRING }
    });

    var amzProducerLambda = new lambda.Function(this, Constants.AmzProducerLambda, {
      functionName: Constants.AmzProducerLambda,
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'lambda2.lambda_handler',
      code: lambda.Code.fromAsset(producerPath),
      timeout : Duration.minutes(3),
      environment : {
        "amz_queue_name": amzSQSQueue.queueName,
      },
    });

    var amzConsumerLambda = new lambda.Function(this, Constants.AmzConsumerLambda, {
      functionName: Constants.AmzConsumerLambda,
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'lambda1.lambda_handler',
      code: lambda.Code.fromAsset(consumerPath),
      timeout : Duration.minutes(2),
      environment : {
        "amz_db_name": amzAppealTable.tableName,
      },
    });

    var amzGetAppealStatusLambda = new lambda.Function(this, Constants.AmzGetAppealStatusLambda, {
      functionName: Constants.AmzGetAppealStatusLambda,
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'lambda3.lambda_handler',
      code: lambda.Code.fromAsset(statusCheckPath),
      timeout : Duration.minutes(2),
      environment : {
        "amz_db_name": amzAppealTable.tableName,
      },
    });

    const apiGateWay = new apigateway.RestApi(this, Constants.appeal);
    const appealStatus = apiGateWay.root.addResource(Constants.appealStatus);
    appealStatus.addMethod(Constants.GET, new apigateway.LambdaIntegration(amzGetAppealStatusLambda, 
      {
        proxy: true,
      }));


    amzSQSQueue.grantSendMessages(amzProducerLambda);
    amzAppealStatusTable.grantReadWriteData(amzConsumerLambda);
    amzAppealStatusTable.grantReadWriteData(amzGetAppealStatusLambda);
    amzAppealTable.grantReadWriteData(amzProducerLambda);
    amzAppealTable.grantReadWriteData(amzGetAppealStatusLambda);

    amzConsumerLambda.addEventSource(
      new SqsEventSource(amzSQSQueue, {
        batchSize: 10,
      }),
    );
  }
}
