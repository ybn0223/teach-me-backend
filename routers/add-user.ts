import express from 'express';
import { handleError } from '../functions/handleError';
import { createUser } from '../server/mongo.db';
import { IUser } from '../models/users.types';

const ADD_USER = express.Router();
	
ADD_USER.post('/add-user', async (request, response) => {
	const USER: IUser = request.body;
	try {
		await createUser(USER);
		response.status(201).send({ message: 'New user has been created' });
	} catch (error: unknown) { 
		handleError(error, response);
	}
});

    
export default ADD_USER;