import express from 'express';
import { getCoursesTitles } from '../server/mongo.db';
import { handleError } from '../functions/handleError';

const GET_COURSES_TITLES_ROUTER = express.Router();

GET_COURSES_TITLES_ROUTER.get('/get-course-titles', async (request, response) => {
	try {
		const COURSE_TITLES: string[] = await getCoursesTitles();
		response.type('json');
		response.status(200);
		response.json(COURSE_TITLES);

	} catch (error: unknown) { 
		handleError(error, response);
	}
});

export default GET_COURSES_TITLES_ROUTER;