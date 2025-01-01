import express from 'express';

const LOGOUT_SESSION = express.Router();

LOGOUT_SESSION.post('/logout', (request, response) => {
	response.clearCookie('session'); 
	response.status(200).json();
});

export default LOGOUT_SESSION;