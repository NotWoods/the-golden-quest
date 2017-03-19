import { askOne } from 'questions';
import { nodes, handleAction, getAllActions } from './game';
import makeHandler from './test/fakeHandler';

const actions = getAllActions();

function testAsk(node: string, action: string) {
	const nodeChoice = nodes.get(node);
	const actionChoice = actions.get(action);
	if (!nodeChoice) {
		console.error('Invalid node ID');
		return;
	}
	if (!actionChoice) {
		console.error('Invalid action message');
		return;
	}

	const handler = makeHandler(nodeChoice);
	handler.once(':tell', (message: string) => console.log(message));
	handler.once(':ask', (message: string) => {
		console.log(message);

		askOne({ info: 'What action do you want to take' }, (action: string) => {
			testAsk(handler.attributes.currentState.node, action);
		});
	});

	handleAction(handler, actionChoice);
}

askOne({ info: 'Type the node ID of your starting state' }, (node: string) => {
	const nodeChoice = nodes.get(node);
	if (!nodeChoice) {
		console.error('Invalid node ID');
		return;
	}

	askOne({
		info: `What action do you want to take (${nodeChoice.actions.map(a => a.message).join()})`
	}, (action: string) => testAsk(node, action));
})
