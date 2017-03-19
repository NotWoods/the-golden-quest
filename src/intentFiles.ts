import { getAllActions } from './game';

const actions = Array.from(getAllActions())
	.filter(([id]) => parseInt(id, 10) < 1000);
const prefix = process.argv[3] || '';

if (process.argv[2] === 'utter') {
	actions.forEach(([,action]) => {
		console.log(`${prefix}${action.node} ${action.message}`);
		console.log('');
	})
} else if (process.argv[2] === 'json') {
	const json = {
		intents: actions.map(([key]) => ({ intent: `${prefix}${key}` })),
	};
	console.log(JSON.stringify(json));
} else {
	console.error('Please use either "utter" or "json"');
}
