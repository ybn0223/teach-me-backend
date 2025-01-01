import express from 'express';
import { deleteCourse } from '../server/mongo.db';
import { handleError } from '../functions/handleError';

const DELETE_COURSE = express.Router();

DELETE_COURSE.delete('/delete-course/:key', async (request, response) =>{
	const COURSE = request.params.key;
	try {
		await deleteCourse(COURSE);
		response
			.status(202)
			.json({ Succes: `course "${COURSE}" has been deleted successfully.` });
	} catch (error: unknown) { 
		handleError(error, response);
	}
});

export default DELETE_COURSE;