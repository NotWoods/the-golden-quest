export enum Direction {
	NORTH, EAST, SOUTH, WEST
}

export default class Player {
	facing: Direction;

	constructor(id: string) {
		this.facing = Direction.NORTH;
	}

	static async getPlayer(id: string): Promise<Player> {
		// TODO
		return new Player(id);
	}

	static async savePlayer(player: Player): Promise<void> {

	}
}
