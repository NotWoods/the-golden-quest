import * as Alexa from 'alexa-sdk';
import * as snakeCase from 'lodash.snakecase';
import parseStory, { StoryNode, Action, PASS_THROUGH } from './parseStory';

export class InvalidActionError extends Error {};

export const nodes: Map<string, StoryNode> = parseStory();

function setNextState(handler: Alexa.Handler, action: Action) {
	const nextState = nodes.get(action.next_id);
	if (!nextState) {
		throw new Error(
			`No nextState found for action! next state: ${action.next_id}, action: ${action.message}`
		);
	}
	handler.attributes.currentState = nextState;
}

export function handleAction(handler: Alexa.Handler, actions: Map<string, Action>) {
	const currentState: StoryNode = handler.attributes.currentState || nodes.get('start');
	if (!currentState) throw new Error('Bad currentState');

	const action = actions.get(currentState.message);

	if (shouldPassThrough(currentState)) {
		const nextAct = currentState.actions.find(a => a.message === PASS_THROUGH);
		if (!nextAct) {
			throw new Error(`Invalid pass-thru action in ${currentState.message}`);
		}

		setNextState(handler, nextAct);
		readStory(handler);
	}

	const isValidAction = action &&
		currentState.actions.some(action => action.message === action.message);
	if (!action) {
		throw new InvalidActionError('No action provided');
	} else if (!isValidAction) {
		throw new InvalidActionError('Invalid action');
	}

	setNextState(handler, action);

	readStory(handler);
}

function createActionsMessage(actions: Action[]) {
	const messages = actions.map(a => a.message);

	const first = messages.slice(0, -1);
	const last = messages[messages.length - 1];

	if (first.length > 0)
		return `Do you want to: ${first.join(', ')} or ${last}?`;
	else
		return `Do you want to: ${last}?`
}

function shouldPassThrough(node: StoryNode) {
	return node.actions.some(action => action.message === PASS_THROUGH);
}

export function readStory(handler: Alexa.Handler, message = '') {
	const story: StoryNode = handler.attributes.currentState;
	if (!story) {
		throw new Error('Invalid currentState!');
	}

	message += story.message;

	if (story.end_state) {
		message += 'The game has ended';
		handler.emit(':tell', message);
		return;
	}

	if (shouldPassThrough(story)) {
		const nextAct = story.actions.find(a => a.message === PASS_THROUGH);
		if (!nextAct) {
			throw new Error(`Invalid pass-thru action in ${story.message}`);
		}

		setNextState(handler, nextAct);
		readStory(handler);
	} else {
		const askMessage = createActionsMessage(story.actions);
		message += askMessage;
		handler.emit(':ask', message, askMessage);
	}
}

export function actionID(action: string | Action): string {
	const msg = typeof action === 'string' ? action : action.message;
	return snakeCase(msg).toUpperCase();
}

export function getAllActions(): Map<string, Map<string, Action>> {
	const allActions = new Map();
	nodes.forEach(node => {
		node.actions.forEach(action => {
			const { message } = action;
			if (!allActions.has(message)) allActions.set(message, new Map());
			allActions.get(message).set(node.message, action);
		});
	});
	return allActions;
}

export default function generateHandlers(): Alexa.Handlers {
	const allActions = getAllActions();

	const handlers: Alexa.Handlers = {};
	allActions.forEach((actions, id) => {
		handlers[actionID(id)] = function() {
			try {
				handleAction(this, actions);
			} catch (err) {
				this.emit(':tell', `Error: ${err.message}`);
			}
		}
	})
	return handlers;
}
