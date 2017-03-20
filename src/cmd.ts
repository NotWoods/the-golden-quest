declare function askOne(
	data: { info: string },
	callback: (response: string) => void,
): void

import { askOne } from 'questions';
import { nodes, handleAction, readStory, getAllActions } from './game';
import { StoryNode } from './parseStory';
import makeHandler from './test/fakeHandler';

const actions = getAllActions();

function testAsk(nodeID: string, actionID?: string) {
	const nodeChoice = nodes.get(nodeID);
	if (!nodeChoice) {
		console.error('Invalid node ID');
		return;
	}

	const handler = makeHandler(nodeChoice);
	handler.once(':tell', (message: string) => console.log(message));
	handler.once(':ask', (message: string) => {
		console.log(message);
		const story: StoryNode = handler.attributes.currentState;

		askOne({ info: 'Type the action you want to take' }, (actionMsg: string) => {
			console.log('');
			testAsk(story.node, actionMsg);
		});
	});

	if (actionID) {
		const actionChoice = actions.get(actionID);
		if (!actionChoice) {
			console.error('Invalid action message');
			return;
		}

		handleAction(handler, actionChoice);
	} else {
		readStory(handler);
	}
}

askOne({ info: 'Type the node ID of your starting state' },
	(node: string) => testAsk(node));
