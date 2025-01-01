import express from 'express';
import { handleError } from '../../functions/handleError';
import * as jwt from 'jsonwebtoken';

const LOGIN_SESSION = express.Router();

function validateToken(token: string) {
	if (!token) {
		const error = new Error('Error: User not logged in.');
		error.name = '301';
		throw error;
	}
	try {
		return jwt.verify(token, process.env.SECRET_KEY!);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (err) {
		const error = new Error('Error: Invalid session.');
		error.name = '401';
		throw error;
	}
}

LOGIN_SESSION.get('/login-session', (request, response) => {
	response.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
	try {
		const TOKEN = request.cookies.session;
		const DECODED = validateToken(TOKEN);
		response.status(200).json({ token: DECODED });
	} catch (error: unknown) {
		handleError(error, response);
	}
});



export default LOGIN_SESSION;