import { generate } from 'shortid';
import parseStory, { Action } from './parseStory';

const games: Map<string, StoryNode> = new Map();
const nodeLoader = parseStory();

export function newID(): string {
	return generate();
}

function handleHelp(currentState: StoryNode) {

}

export async function startGame(gameID: string): Promise<StoryNode> {
	const nodes = await nodeLoader;
	const start = nodes.get('start');

	games.set(gameID, start);
	return start;
}

export async function useAction(gameID: string, action: Action): Promise<StoryNode> {
	const currentState = games.get(gameID);
	const nextAction = currentState.actions.find(a => a.next_id === action.next_id);
	if (!nextAction) {
		throw new Error(`Invalid action, ${currentState.id} doesn't contain ${action.text}`);
	}

	games.set(gameID, nextAction.next);
	return nextAction.next;
}
