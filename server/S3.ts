// import { ICourse } from '../models/course.types';
// import { isTypeOfUser, IUser } from '../models/users.types';
// import { BUCKET, BUCKET_NAME } from './config.s3';
// import bcrypt from 'bcrypt';
// import {
// 	_Object, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command,
// 	PutObjectCommand
// } from '@aws-sdk/client-s3';

// export const getOneCourse = async (courseKey: string) => {
// 	const COURSE_KEY = `courses/${courseKey}.json`;
// 	const PARAMS = {
// 		Bucket: BUCKET_NAME,
// 		Key: COURSE_KEY
// 	};
// 	const ALL_COURSES = await getCoursesTitles();
// 	if (ALL_COURSES.includes(courseKey)) {
// 		const COMMAND = new GetObjectCommand(PARAMS);
// 		const DATA = await BUCKET.send(COMMAND);
// 		try {
// 			const OBJECT_BYTEARRAY = await DATA.Body?.transformToByteArray();
// 			const FORMATTED_DATA = new TextDecoder('utf-8').decode(OBJECT_BYTEARRAY);
// 			const JSON_OBJECT = JSON.parse(FORMATTED_DATA);
// 			return { key: courseKey, content: JSON_OBJECT };
// 		} catch {
// 			const ERROR: Error = new Error('Error: Decoding failed.');
// 			ERROR.name = '500';
// 			throw ERROR;
// 		}
// 	} else {
// 		const ERROR: Error = new Error('Error: no course found.');
// 		ERROR.name = '404';
// 		throw ERROR;
// 	}
// };

// export const getCoursesTitles = async () => {
// 	const PARAMS = {
// 		Bucket: BUCKET_NAME,
// 		Prefix: 'courses'
// 	};
// 	const COMMAND = new ListObjectsV2Command(PARAMS);
// 	const DATA = await BUCKET.send(COMMAND);
// 	if (!DATA.Contents) {
// 		const ERROR: Error = new Error('Error: Course has no content.');
// 		ERROR.name = '404';
// 		throw ERROR;
// 	}
// 	const COURSE_TITLES: string[] = DATA.Contents.map((object) => {
// 		return filterTitles(object);
// 	});
// 	COURSE_TITLES.shift();
// 	return COURSE_TITLES;
// };

// const filterTitles = (object: _Object) => {
// 	if (object.Key) {
// 		return object.Key.toString().substring(8, object.Key.toString().length - 5);
// 	} else {
// 		const ERROR: Error = new Error('Error: Course has no title');
// 		ERROR.name = '500';
// 		throw ERROR;
// 	}
// };

// export const createCourse = async (course: ICourse) => {
// 	const PARAMS = {
// 		Bucket: BUCKET_NAME,
// 		Prefix: 'courses',
// 		Key: `courses/${course.name}.json`,
// 		Body: JSON.stringify(course),
// 		ContentType: 'application/json'
// 	};
// 	const ALL_COURSES = await getCoursesTitles();
// 	if (ALL_COURSES.includes(course.name)) {
// 		const ERROR: Error = new Error(`Error: course name "${course.name}" already exists.`);
// 		ERROR.name = '404';
// 		throw ERROR;
// 	}
// 	await BUCKET.send(new PutObjectCommand(PARAMS));
// };

// export const deleteCourse = async (courseName: string) => {
// 	const PARAMS = {
// 		Bucket: BUCKET_NAME,
// 		Prefix: 'courses',
// 		Key: `courses/${courseName}.json`
// 	};

// 	const ALL_COURSES = await getCoursesTitles();
// 	if (ALL_COURSES.includes(courseName)) {
// 		await BUCKET.send(new DeleteObjectCommand(PARAMS));
// 	}
// 	else {
// 		const ERROR: Error = new Error(`Error: Course "${courseName}" does not exist`);
// 		ERROR.name = '404';
// 		throw ERROR;
// 	}
// };

// export const modifyCourse = async (course: ICourse) => {
// 	const PARAMS = {
// 		Bucket: BUCKET_NAME,
// 		Prefix: 'courses',
// 		Key: `courses/${course.name}.json`,
// 		Body: JSON.stringify(course),
// 		ContentType: 'application/json'
// 	};
// 	const ALL_COURSES = await getCoursesTitles();
// 	if (ALL_COURSES.includes(course.name)) {
// 		await BUCKET.send(new PutObjectCommand(PARAMS));
// 	}
// 	else {
// 		const ERROR: Error = new Error(`Error: Course "${course.name}" does not exist`);
// 		ERROR.name = '404';
// 		throw ERROR;
// 	}
// };

// function checkCreateUserValid(user: IUser) {
// 	if (user.username.trim() === '') {
// 		return `Error: username "${user.username}"" is not valid.`;
// 	}
// 	if (user.password.trim() === '') {
// 		return `Error: password "${user.username}" is not valid.`;
// 	}
// }

// function errorWrongUserType(user: IUser) {
// 	if (!isTypeOfUser(user)) {
// 		const ERROR: Error = new Error('Error: User object has wrong format.');
// 		ERROR.name = '404';
// 		throw ERROR;
// 	}
// }
// export const createUser = async (user: IUser) => {
// 	errorWrongUserType(user);
// 	const CREATE_USER_CHECK = checkCreateUserValid(user);
// 	if (CREATE_USER_CHECK !== undefined) {
// 		const ERROR: Error = new Error(CREATE_USER_CHECK);
// 		ERROR.name = '404';
// 		throw ERROR;
// 	}
// 	const USERS: IUser[] = await getAllUsers();
// 	const USER: IUser = {
// 		username: user.username,
// 		password: await bcrypt.hash(user.password, 10),
// 		type: user.type
// 	};
// 	const USER_ALREADY_EXISTS: IUser[] = USERS.filter(x => x.username === USER.username);
// 	if (USER_ALREADY_EXISTS.length === 1) {
// 		const ERROR: Error = new Error(`Error: user "${USER.username}" already exists.`);
// 		ERROR.name = '404';
// 		throw ERROR;
// 	}
// 	USERS.push(USER);
// 	const PARAMS = {
// 		Bucket: BUCKET_NAME,
// 		Prefix: 'users',
// 		Key: 'users/profiles.json',
// 		Body: JSON.stringify(USERS),
// 		ContentType: 'application/json'
// 	};
// 	await BUCKET.send(new PutObjectCommand(PARAMS));
// };

// export const modifyUser = async (user: IUser, username: string) => {
// 	errorWrongUserType(user);

// 	const NOT_VALID_USER = checkCreateUserValid(user);
// 	if (NOT_VALID_USER) {
// 		const ERROR: Error = new Error(`Error: ${NOT_VALID_USER}`);
// 		ERROR.name = '400';
// 		throw ERROR;
// 	}
// 	const USERS: IUser[] = await getAllUsers();
// 	const USER: IUser = {
// 		username: user.username,
// 		password: await bcrypt.hash(user.password, 10),
// 		type: user.type
// 	};
// 	const EXISTSING_USER_INDEX = USERS.findIndex(x => x.username === username);
// 	if (EXISTSING_USER_INDEX === -1) {
// 		const ERROR: Error = new Error(`Error: user ${username} does not exist.`);
// 		ERROR.name = '400';
// 		throw ERROR;
// 	}
// 	USERS.splice(EXISTSING_USER_INDEX);
// 	USERS.push(USER);
// 	const PARAMS = {
// 		Bucket: BUCKET_NAME,
// 		Key: 'users/profiles.json',
// 		Body: JSON.stringify(USERS),
// 		ContentType: 'application/json',
// 	};

// 	await BUCKET.send(new PutObjectCommand(PARAMS));
// };

// export const deleteUser = async (userName: string) => {
// 	const USERS: IUser[] = await getAllUsers();
// 	const ALL_USERS = await getAllUsers();
// 	const ALL_USERNAMES: string[] = [];
// 	ALL_USERS.map(x => ALL_USERNAMES.push(x.username));


// 	if (ALL_USERNAMES.includes(userName)) {
// 		const FILTERED_USER = USERS.filter((x) => x.username !== userName);

// 		const PARAMS = {
// 			Bucket: BUCKET_NAME,
// 			Prefix: 'users',
// 			Key: 'users/profiles.json',
// 			Body: JSON.stringify(FILTERED_USER),
// 			ContentType: 'application/json'
// 		};
// 		await BUCKET.send(new PutObjectCommand(PARAMS));
// 	}
// 	else {
// 		const ERROR: Error = new Error(`Error: user "${userName}" not found.`);
// 		ERROR.name = '404';
// 		throw ERROR;
// 	}
// };

// export const loginUser = async (username: string, password: string) => {
// 	const USERS: IUser[] = await getAllUsers();

// 	const USER = USERS.find(user =>
// 		user.username === username && bcrypt.compareSync(password, user.password)
// 	);

// 	return USER;
// };

// export const getAllUsers = async () => {
// 	const PARAMS = {
// 		Bucket: BUCKET_NAME,
// 		Key: 'users/profiles.json'
// 	};
// 	const COMMAND = new GetObjectCommand(PARAMS);
// 	const DATA = await BUCKET.send(COMMAND);
// 	if (!DATA.Body) {
// 		const ERROR: Error = new Error('Error: No users found.');
// 		ERROR.name = '404';
// 		throw ERROR;
// 	}
// 	try {
// 		const OBJECT_BYTEARRAY = await DATA.Body.transformToByteArray();
// 		const FORMATTED_DATA = new TextDecoder('utf-8').decode(OBJECT_BYTEARRAY);
// 		const JSON_OBJECT: IUser[] = JSON.parse(FORMATTED_DATA);
// 		return JSON_OBJECT;

// 	} catch {
// 		const ERROR: Error = new Error('Error: Decoding failed.');
// 		ERROR.name = '500';
// 		throw ERROR;
// 	}
// };

// export const getAllUserNames = async () => {
// 	const ALL_USERS: IUser[] = await getAllUsers();
// 	let ALL_USERNAMES: string[] = [];
// 	ALL_USERS.map((x) => {
// 		ALL_USERNAMES.push(x.username);
// 	});
// 	return ALL_USERNAMES;
// };