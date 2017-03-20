import * as test from 'blue-tape';
import { nodes, handleAction, getAllActions } from '../game';
import makeHandler from './fakeHandler';

const actionList = getAllActions();

test('handleAction', t => {
	const lost = nodes.get('lost_in_school');
	if (!lost) throw new Error();
	const handlerTester = makeHandler(lost);

	const friend = nodes.get('friend');
	const runHome = actionList.get('run home');
	if (!friend || !runHome) {
		t.fail('Missing friend node or run home action');
		return;
	}

	handlerTester.on(':ask', (message: string) => {
		const friendMsg = friend.message;
		t.assert(message.includes(friendMsg), `asked message includes ${friendMsg}`);
		t.end();
	});

	handleAction(handlerTester, runHome);
})


