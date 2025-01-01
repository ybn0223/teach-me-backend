import express from 'express';
import { handleError } from '../functions/handleError';
import { deleteUser } from '../server/mongo.db';

const DELETE_USER = express.Router();
	
DELETE_USER.delete('/delete-user/:userName', async (request, response) => {
	const USERNAME: string = request.params.userName;
	try {
		await deleteUser(USERNAME);
		response.status(200).send({ message: 'User has been deleted' });
	} catch (error: unknown) { 
		handleError(error, response);
	}
});

    
export default DELETE_USER;