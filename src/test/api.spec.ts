import * as test from 'blue-tape';
import * as Alexa from 'alexa-sdk';
import { handler } from '../index';

const json = JSON.parse(`{
  "session": {
    "sessionId": "SessionId.8d0406ae-bf44-40e5-b0f0-d15f86bf10ba",
    "application": {
      "applicationId": "amzn1.ask.skill.3ea8d59f-74e9-4adf-8485-00cf55b2995f"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.AFFS2LTJGRZTMMZI4KMUPZ3JM72NDK3IBJHTMKFDQOMUE57J37SJOX52UVNNXL2Z5BYZTDMWTO7S3RPF3NHXBDUCCSIVW7GJNO2OG5X5GOVVWU3BL4ZK74LOHZDEYNXYMOHUSQI3CAGNKPJPERNLWJ7VVVWM5YF4PYSLCL2UQXPV3XLUDIYCP2Y7JMCMECQKIHENNCVNKSEJS3I"
    },
    "new": true
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.b50085c8-3c29-486b-90ba-93350d8d6266",
    "locale": "en-US",
    "timestamp": "2017-03-19T08:32:49Z",
    "intent": {
      "name": "RUN_AWAY",
      "slots": {}
    }
  },
  "version": "1.0"
}`);

test('handler', t => {
	t.plan(1);
	handler(json, <Alexa.Context & { succeed: Function }> {
    callbackWaitsForEmptyEventLoop: true,
    logGroupName: '',
    logStreamName: '',
    functionName: 'alexaDungeonCrawler',
    memoryLimitInMB: '',
    functionVersion: '',
    invokeid: '',
    awsRequestId: '',
		succeed(body: Alexa.ResponseBody) {
			console.log(body);
      const output = body.response.outputSpeech;
      if (!output) {
        t.fail('Missing outputSpeech');
        return;
      }

      const text = output.type === 'SSML' ? output.ssml : output.text;
      if (!text) {
        t.fail('Missing text');
        return;
      }

			t.pass(`RESPONSE: ${text}`);
		},
		fail() {
			t.fail();
		}
	}, () => {});
})
