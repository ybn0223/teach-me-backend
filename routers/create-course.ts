import express from 'express';
import { createCourse } from '../server/mongo.db';
import { ICourse } from '../models/course.types';
import { handleError } from '../functions/handleError';

const CREATE_COURSE_ROUTER = express.Router();

CREATE_COURSE_ROUTER.post('/create-course', async (request, response) => {
	const COURSE : ICourse = request.body;
	try {
		await createCourse(COURSE);
		response.status(201);
		response.json({
			course: `${COURSE.content.name} has been created successfully`
		});
	} catch (error: unknown) { 
		handleError(error, response);
	}
});

export default CREATE_COURSE_ROUTER;