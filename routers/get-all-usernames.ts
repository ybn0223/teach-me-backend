import express from 'express';
import { getAllUserNames } from '../server/mongo.db';
import { handleError } from '../functions/handleError';

const GET_ALL_USERNAMES = express.Router();

GET_ALL_USERNAMES.get('/get-all-usernames', async (request, response) => {
	try {
		const ALL_USERNAMES: string[] = await getAllUserNames();
		response.type('json');
		response.status(200);
		response.json(ALL_USERNAMES);

	} catch (error: unknown) { 
		handleError(error, response);
	}
});

export default GET_ALL_USERNAMES;