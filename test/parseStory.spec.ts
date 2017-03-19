import parseStory from '../src/parseStory';

async function testParseStory() {
	console.log('Parsing story file...');
	const nodes = await parseStory();

	nodes.forEach(node => console.log(node));
}
