import { getAllActions } from './game';
import { PASS_THROUGH } from './parseStory';

const actions = getAllActions();
const prefix = process.argv[3] || '';

if (process.argv[2] === 'utter') {
	actions.forEach(action => {
		if (action.message === PASS_THROUGH) return;
		console.log(`${prefix}${action.node} ${action.message}`);
		console.log('');
	})
} else if (process.argv[2] === 'json') {
	const json: any = { intents: [] };
	actions.forEach(({ message }, key) => {
		if (message === PASS_THROUGH) return;
		json.intents.push({ intent: `${prefix}${key}` });
	})
	console.log(JSON.stringify(json));
} else {
	console.error('Please use either "utter" or "json"');
}
