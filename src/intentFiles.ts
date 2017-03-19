import { getAllActions, actionID } from './game';
import { PASS_THROUGH } from './parseStory';

const actions = getAllActions();
const prefix = process.argv[3] || '';

if (process.argv[2] === 'utter') {
	actions.forEach((actions, message) => {
		if (message === PASS_THROUGH) return;
		console.log(`${prefix}${actionID(message)} ${message}`);
		console.log('');
	})
} else if (process.argv[2] === 'json') {
	const json: any = { intents: [] };
	actions.forEach((actions, message) => {
		if (message === PASS_THROUGH) return;
		json.intents.push({ intent: `${prefix}${actionID(message)}` });
	})
	console.log(JSON.stringify(json));
} else {
	console.error('Please use either "utter" or "json"');
	console.error(`node ./out/intentFiles {utter|json} {prefix?}`);
}
