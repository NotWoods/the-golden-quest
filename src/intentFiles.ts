import { getAllActions } from './game';

const actions = getAllActions();
const prefix = process.argv[3] || '';

if (process.argv[2] === 'utter') {
	actions.forEach(action => {
		console.log(`${prefix}${action.node} ${action.message}`);
		console.log('');
	})
} else if (process.argv[2] === 'json') {
	const json = {
		intents: Array.from(actions.keys(), key => ({ intent: `${prefix}${key}` }))
	};
	console.log(JSON.stringify(json));
} else {
	console.error('Please use either "utter" or "json"');
}
