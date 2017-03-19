import { generate } from 'shortid';
import { Action } from './parseStory';

export function newID(): string {
	return generate();
}

export async function startGame(gameID: string): Promise<StoryNode> {

}

export async function useAction(gameID: string, action: Action): Promise<StoryNode> {

}
