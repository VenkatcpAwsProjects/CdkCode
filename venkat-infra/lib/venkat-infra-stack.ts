import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class VenkatInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'VenkatInfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    var bucket1 = new s3.Bucket(this, 'VenkatCdkBucket1234qwert1sd', {
      versioned: true
    });
  }
}
