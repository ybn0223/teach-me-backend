import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { ICourse, IUser } from '../models/course.types';



const CourseModel = mongoose.model<ICourse>('Course', new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    content: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        passingGrade: { type: String, required: true },
        completeTime: { type: String, required: true },
        questionCategories: { type: [String], required: true },
        questions: { type: [Object], required: true },
        date: { type: String, required: true },
    },
}));

const UserModel = mongoose.model<IUser>('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
}));

export const getOneCourse = async (courseKey: string): Promise<ICourse> => {
    const course = await CourseModel.findOne({ key: courseKey });
    if (!course) {
        const ERROR = new Error('Error: no course found.');
        ERROR.name = '404';
        throw ERROR;
    }
    return { key: courseKey, content: course.content };
};

export const getCoursesTitles = async (): Promise<string[]> => {
    const courses = await CourseModel.find({}, 'key');
    return courses.map((course: { key: any; }) => course.key);
};

export const createCourse = async (course: ICourse): Promise<void> => {
    const existingCourse = await CourseModel.findOne({ key: course.key });
    if (existingCourse) {
        const ERROR = new Error(`Error: course key "${course.key}" already exists.`);
        ERROR.name = '404';
        throw ERROR;
    }
    const newCourse = new CourseModel(course);
    await newCourse.save();
};

export const deleteCourse = async (courseKey: string): Promise<void> => {
    const deletedCourse = await CourseModel.findOneAndDelete({ key: courseKey });
    if (!deletedCourse) {
        const ERROR = new Error(`Error: Course "${courseKey}" does not exist`);
        ERROR.name = '404';
        throw ERROR;
    }
};

export const modifyCourse = async (course: ICourse): Promise<void> => {
    const updatedCourse = await CourseModel.findOneAndUpdate(
        { key: course.key },
        { content: course.content },
        { new: true }
    );
    if (!updatedCourse) {
        const ERROR = new Error(`Error: Course "${course.key}" does not exist`);
        ERROR.name = '404';
        throw ERROR;
    }
};

function checkCreateUserValid(user: IUser): string | undefined {
    if (user.username.trim() === '') {
        return `Error: username "${user.username}" is not valid.`;
    }
    if (user.password.trim() === '') {
        return `Error: password for username "${user.username}" is not valid.`;
    }
}

function errorWrongUserType(user: IUser): void {
    if (typeof user.username !== 'string' || typeof user.password !== 'string' || typeof user.type !== 'string') {
        const ERROR = new Error('Error: User object has wrong format.');
        ERROR.name = '404';
        throw ERROR;
    }
}

export const createUser = async (user: IUser): Promise<void> => {
    errorWrongUserType(user);
    const CREATE_USER_CHECK = checkCreateUserValid(user);
    if (CREATE_USER_CHECK !== undefined) {
        const ERROR = new Error(CREATE_USER_CHECK);
        ERROR.name = '404';
        throw ERROR;
    }
    const existingUser = await UserModel.findOne({ username: user.username });
    if (existingUser) {
        const ERROR = new Error(`Error: user "${user.username}" already exists.`);
        ERROR.name = '404';
        throw ERROR;
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new UserModel({ ...user, password: hashedPassword });
    await newUser.save();
};

export const modifyUser = async (user: IUser, username: string): Promise<void> => {
    errorWrongUserType(user);
    const NOT_VALID_USER = checkCreateUserValid(user);
    if (NOT_VALID_USER) {
        const ERROR = new Error(`Error: ${NOT_VALID_USER}`);
        ERROR.name = '400';
        throw ERROR;
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const updatedUser = await UserModel.findOneAndUpdate(
        { username },
        { username: user.username, password: hashedPassword, type: user.type },
        { new: true }
    );
    if (!updatedUser) {
        const ERROR = new Error(`Error: user ${username} does not exist.`);
        ERROR.name = '400';
        throw ERROR;
    }
};

export const deleteUser = async (username: string): Promise<void> => {
    const deletedUser = await UserModel.findOneAndDelete({ username });
    if (!deletedUser) {
        const ERROR = new Error(`Error: user "${username}" not found.`);
        ERROR.name = '404';
        throw ERROR;
    }
};

export const loginUser = async (username: string, password: string): Promise<IUser | null> => {
    const user = await UserModel.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return null;
    }
    return user;
};

export const getAllUsers = async (): Promise<IUser[]> => {
    return await UserModel.find();
};

export const getAllUserNames = async (): Promise<string[]> => {
    const users = await UserModel.find({}, 'username');
    return users.map((user: { username: any; }) => user.username);
};


const dbURI = 'mongodb+srv://school:school@mycluster.rj0zjqu.mongodb.net/';

export const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        process.on("SIGINT", disconnectDB);
        console.log('Verbonden met de database');
    } catch (error) {
        console.error('Fout bij het verbinden met de database:', error);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Verbinding met de database gesloten');
        process.exit(1);
    } catch (error) {
        console.error('Fout bij het sluiten van de databaseverbinding:', error);
    }
};