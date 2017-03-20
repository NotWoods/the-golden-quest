import { getAllActions, actionID } from './game';
import { PASS_THROUGH } from './parseStory';

const actions = getAllActions();
const prefix = process.argv[3] || '';
const output = process.stdout;

if (process.argv[2] === 'utter') {
	Array.from(actions.keys()).forEach(message => {
		if (message === PASS_THROUGH) return;
		output.write(`${prefix}${actionID(message)} ${message}\n\n`, 'utf8');
	});
	process.exit(0);
} else if (process.argv[2] === 'json') {
	const json: any = { intents: [] };
	Array.from(actions.keys()).forEach(message => {
		if (message === PASS_THROUGH) return;
		json.intents.push({ intent: `${prefix}${actionID(message)}` });
	});
	json.intents.push(
		{ intent: 'AMAZON.HelpIntent' },
		{ intent: 'AMAZON.RepeatIntent' },
		{ intent: 'AMAZON.StartOverIntent' },
		{ intent: 'AMAZON.CancelIntent' },
		{ intent: 'AMAZON.StopIntent' },
		{ intent: 'AMAZON.PreviousIntent' },
	)
	output.write(JSON.stringify(json), 'utf8');
	process.exit(0);
} else {
	console.error('Please use either "utter" or "json"');
	console.error(`node ./out/intentFiles {utter|json} {prefix?}`);
	process.exit(1);
}
