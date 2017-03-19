import * as Alexa from 'alexa-sdk';
import parseStory, { StoryNode, Action, PASS_THROUGH } from './parseStory';

export class InvalidActionError extends Error {};

export const nodes: Map<string, StoryNode> = parseStory();

export function handleAction(this: Alexa.Handler, action: Action) {
	const currentState: StoryNode = this.attributes.currentState || nodes.get('start');
	if (!currentState) throw new Error();

	const isValidAction = currentState.actions.some(action => action.message === action.message);
	if (!isValidAction) {
		throw new InvalidActionError();
	}

	const nextState = nodes.get(action.next_id);
	this.attributes.currentState = nextState;

	readStory.call(this);
}

function createActionsMessage(actions: Action[]) {
	const first = actions.slice(0, -1);
	const last = actions[actions.length - 1];
	return `Do you want to ${first.join(', ')} or ${last}`;
}

function shouldPassThrough(node: StoryNode) {
	return node.actions.some(action => action.message === PASS_THROUGH);
}

export function readStory(this: Alexa.Handler) {
	const story = this.attributes.currentNode;

	const { message } = story;
	this.emit(':tell', message);

	if (shouldPassThrough(story)) {
		readStory.call(this);
	} else {
		const askMessage = createActionsMessage(story.actions);
		this.emit(':ask', askMessage, askMessage);
	}
}


export default function generateHandlers(): Alexa.Handlers {

}
