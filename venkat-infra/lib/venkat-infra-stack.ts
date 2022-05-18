import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from 'path';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { AccountPrincipal, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export class VenkatInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //The code to create role and policy
    var accId = "161069081910";
    var a = new AccountPrincipal(accId);
    const role = new iam.Role(this, 'CategoryDetailsMapperExternalAwsRole', {
      roleName: 'CategoryDetailsMapperExternalAwsRole',
      assumedBy: a,
      description: 'External AWS role for other AWS account['+ accId +'] to read the Category Details Mapper AWS App config.',
    });

    // 👇 Create a Managed Policy and associate it with the role
    const managedPolicy = new iam.ManagedPolicy(this, 'CategoryDetailsMapperAppConfigReadPolicy', {
      managedPolicyName: "CategoryDetailsMapperAppConfigReadPolicy",
      description: 'Allows app-config read access',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['appconfig:GetLatestConfiguration', 'appconfig:StartConfigurationSession'],
          resources: ['arn:aws:appconfig:us-east-1:638373575924:application/CategoryDetailsConfig/environment/CategoryDetailsConfig-env/configuration/CategoryDetailsConfigProfile-S3BasedConfigurationProfile'],
        }),
      ],
      roles: [role],
    });

    // The code that defines your stack goes here

    var amzSQSQueue = new sqs.Queue(this, 'AmzSQSQueue', 
    {
       queueName: 'AmzSQSQueue',
       "visibilityTimeout" : Duration.minutes(3)
    });

    var producerPath = path.join(__dirname, 'producer-lambda');
    var consumerPath = path.join(__dirname, 'consumer-lambda');

    const amzTable = new dynamodb.Table(this, 'AmzAppealTable', {
      tableName: 'AmzAppealTable',
      partitionKey: { name: 'appealId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'appealDedupId', type: dynamodb.AttributeType.STRING }
    });

    var amzProducerLambda = new lambda.Function(this, 'AmzProducerLambda', {
      functionName: 'AmzProducerLambda',
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'lambda2.lambda_handler',
      code: lambda.Code.fromAsset(producerPath),
      timeout : Duration.minutes(3),
      environment : {
        "amz_queue_name": amzSQSQueue.queueName,
      },
    });

    var amzConsumerLambda = new lambda.Function(this, 'AmzConsumerLambda', {
      functionName: 'AmzConsumerLambda',
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'lambda1.lambda_handler',
      code: lambda.Code.fromAsset(consumerPath),
      timeout : Duration.minutes(2),
      environment : {
        "amz_db_name": amzTable.tableName,
      },
    });

    amzSQSQueue.grantSendMessages(amzProducerLambda);
    amzTable.grantReadWriteData(amzConsumerLambda);

    amzConsumerLambda.addEventSource(
      new SqsEventSource(amzSQSQueue, {
        batchSize: 10,
      }),
    );
  }
}
