import express from 'express';

export const handleError = (error: unknown, response: express.Response) => {
	if (error instanceof Error) {
		response.status(Number(error.name));
		response.json(error.message);
	}
	else {
		response.status(500).json({ error: 'Unknown error occurred' });
	}
};


