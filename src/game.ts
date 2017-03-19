import * as Alexa from 'alexa-sdk';
import parseStory, { StoryNode, Action, PASS_THROUGH } from './parseStory';

export class InvalidActionError extends Error {};

export const nodes: Map<string, StoryNode> = parseStory();

export function handleAction(handler: Alexa.Handler, action: Action) {
	const currentState: StoryNode = handler.attributes.currentState || nodes.get('start');
	if (!currentState) throw new Error();

	const isValidAction = currentState.actions.some(action => action.message === action.message);
	if (!isValidAction) {
		throw new InvalidActionError();
	}

	const nextState = nodes.get(action.next_id);
	handler.attributes.currentState = nextState;

	readStory(handler);
}

function createActionsMessage(actions: Action[]) {
	const first = actions.slice(0, -1);
	const last = actions[actions.length - 1];
	return `Do you want to ${first.join(', ')} or ${last}`;
}

function shouldPassThrough(node: StoryNode) {
	return node.actions.some(action => action.message === PASS_THROUGH);
}

export function readStory(handler: Alexa.Handler) {
	const story = handler.attributes.currentState;

	const { message } = story;
	handler.emit(':tell', message);

	if (shouldPassThrough(story)) {
		readStory(handler);
	} else {
		const askMessage = createActionsMessage(story.actions);
		handler.emit(':ask', askMessage, askMessage);
	}
}

export function getAllActions(): Map<string, Action> {
	const allActions = new Map();
	for (const { actions } of nodes.values()) {
		for (const action of actions) allActions.set(action.message, action);
	}
	return allActions;
}

export default function generateHandlers(): Alexa.Handlers {
	const allActions = new Map();
	for (const { actions } of nodes.values()) {
		for (const action of actions) allActions.set(action.message, action);
	}

	const handlers: Alexa.Handlers = {};
	for (const [id, action] of allActions) {
		handlers[id] = function() { handleAction(this, action); }
	}
	return handlers;
}
