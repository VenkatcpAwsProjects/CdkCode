"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenkatInfraStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_cdk_lib_2 = require("aws-cdk-lib");
// import * as sqs from 'aws-cdk-lib/aws-sqs';
class VenkatInfraStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        // example resource
        // const queue = new sqs.Queue(this, 'VenkatInfraQueue', {
        //   visibilityTimeout: cdk.Duration.seconds(300)
        // });
        var bucket1 = new aws_cdk_lib_2.aws_s3.Bucket(this, 'VenkatCdkBucket1234qwert1sd', {
            versioned: true
        });
    }
}
exports.VenkatInfraStack = VenkatInfraStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVua2F0LWluZnJhLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidmVua2F0LWluZnJhLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFnRDtBQUVoRCw2Q0FBMkM7QUFDM0MsOENBQThDO0FBRTlDLE1BQWEsZ0JBQWlCLFNBQVEsbUJBQUs7SUFDekMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qiw2Q0FBNkM7UUFFN0MsbUJBQW1CO1FBQ25CLDBEQUEwRDtRQUMxRCxpREFBaUQ7UUFDakQsTUFBTTtRQUNOLElBQUksT0FBTyxHQUFHLElBQUksb0JBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLDZCQUE2QixFQUFFO1lBQy9ELFNBQVMsRUFBRSxJQUFJO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQWRELDRDQWNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IGF3c19zMyBhcyBzMyB9IGZyb20gJ2F3cy1jZGstbGliJztcbi8vIGltcG9ydCAqIGFzIHNxcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3FzJztcblxuZXhwb3J0IGNsYXNzIFZlbmthdEluZnJhU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXG5cbiAgICAvLyBleGFtcGxlIHJlc291cmNlXG4gICAgLy8gY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHRoaXMsICdWZW5rYXRJbmZyYVF1ZXVlJywge1xuICAgIC8vICAgdmlzaWJpbGl0eVRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMwMClcbiAgICAvLyB9KTtcbiAgICB2YXIgYnVja2V0MSA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ1ZlbmthdENka0J1Y2tldDEyMzRxd2VydDFzZCcsIHtcbiAgICAgIHZlcnNpb25lZDogdHJ1ZVxuICAgIH0pO1xuICB9XG59XG4iXX0=