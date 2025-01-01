import express from 'express';
import { getOneCourse } from '../server/mongo.db';
import { handleError } from '../functions/handleError';

const GET_COURSE_ROUTER = express.Router();

GET_COURSE_ROUTER.get('/get-course/:key', async (request, response) => {
	try {
		const COURSE = await getOneCourse(request.params.key);
		response.type('json');
		response.json(COURSE);

	} catch (error: unknown) { 
		handleError(error, response);
	}
});

export default GET_COURSE_ROUTER;