export type StoryID = string;
export interface StoryNode {
	text: string
	paths: { [action: string]: StoryID }
}

const stories: { [id: string]: StoryNode } = {

}

export default stories;
