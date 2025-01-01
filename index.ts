import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import APIROUTER from './routers/api';
import serverless from 'serverless-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './server/mongo.db';

dotenv.config();

const APP : Express = express();

APP.set('view engine', 'ejs');
APP.use(express.json());
//tijdelijk om request te kunnen handlen lokaal
APP.use(cors({
	origin: 'http://localhost:5173', 
	credentials: true 
}));
APP.use(express.json({ limit:'10mb' }));
APP.use(express.urlencoded({ limit:'10mb', parameterLimit:50, extended: true }));
APP.use(express.static(path.join(__dirname, 'public')));
APP.use(cookieParser());
APP.set('views', path.join(__dirname, 'views'));
APP.set('port', process.env.PORT ?? 3000);

APP.use('/api', APIROUTER);
APP.listen(process.env.PORT, () => {
	connectDB();
	console.log(`Server started on http://localhost:${process.env.PORT}`);
});
APP.use((request, response) => {
	response.status(404).json({
		error: 'The specified path does not exist.'
	});
});

export const HANDLER = serverless(APP);