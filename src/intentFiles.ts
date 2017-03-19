import snakeCase from 'lodash.snakecase';
import { getAllActions } from './game';
import { PASS_THROUGH } from './parseStory';

const actions = getAllActions();
const prefix = process.argv[3] || '';

if (process.argv[2] === 'utter') {
	actions.forEach((actions, message) => {
		if (message === PASS_THROUGH) return;
		console.log(`${prefix}${snakeCase(message)} ${message}`);
		console.log('');
	})
} else if (process.argv[2] === 'json') {
	const json: any = { intents: [] };
	actions.forEach((actions, message) => {
		if (message === PASS_THROUGH) return;
		json.intents.push({ intent: `${prefix}${snakeCase(message)}` });
	})
	console.log(JSON.stringify(json));
} else {
	console.error('Please use either "utter" or "json"');
}
