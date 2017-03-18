import * as fs from 'fs';
import { resolve } from 'path';
import denodeify from 'denodeify';

export const readFile = denodeify(fs.readFile);

export async function readSampleUtterances(language = 'en_US'): Promise<string> { //export use in different file, returns a promise 
	return readFile(
		resolve(__dirname, `../speechAssets/SampleUtterances_${language}`),
		'utf8'
	);
}
