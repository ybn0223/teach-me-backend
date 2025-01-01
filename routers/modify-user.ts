import express from 'express';
import { handleError } from '../functions/handleError';
import { modifyUser } from '../server/mongo.db';
import { IUser } from '../models/users.types';

const MODIFY_USER = express.Router();
	
MODIFY_USER.put('/modify-user/:username', async (request, response) => {
	const USER: IUser = request.body;
	const USERNAME = request.params.username;
	try {
		await modifyUser(USER, USERNAME);
		response.status(201).send({ message: 'User has been modified' });
	} catch (error: unknown) { 
		handleError(error, response);
	}
});

    
export default MODIFY_USER;