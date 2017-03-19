export default class Player {
	state: StoryNode;

	constructor(id: string) {

	}

	static async getPlayer(id: string): Promise<Player> {
		// TODO
		return new Player(id);
	}

	static async savePlayer(player: Player): Promise<void> {

	}
}
