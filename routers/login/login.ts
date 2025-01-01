import express from 'express';
import { handleError } from '../../functions/handleError';
import { loginUser } from '../../server/mongo.db';
import * as jwt from 'jsonwebtoken';

const LOGIN = express.Router();
    
LOGIN.post('/login', async (request, response) => {
	try {
		const { USERNAME, PASSWORD } = request.body;
        
		const user = await loginUser( USERNAME, PASSWORD );
		if (user) {
			const token = jwt.sign({ USERNAME, TYPE: user.type }, process.env.SECRET_KEY!, 
				{ expiresIn: '12h' });
    
			response.cookie('session', token, {
				secure: true,
				sameSite: 'strict',
				maxAge: 12 * 60 * 60 * 1000 
			});
			response.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
			
			response.status(200).json({ type: user.type, username: user.username });
		} else {
			response.status(401).json( 'Username or password incorrect!' );
		}
	} catch (error: unknown) { 
		handleError(error, response);
	}
});

    
export default LOGIN;