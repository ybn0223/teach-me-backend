import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import APIROUTER from './routers/api';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './server/mongo.db';

// Configuratie van environment-variabelen
dotenv.config();

// Initialiseer express app
const APP: Express = express();

// Bereken __dirname en __filename
const __filename = path.join(process.cwd(), 'api', 'index.ts');
const __dirname = path.dirname(__filename);

// Stel view-engine en views directory in
APP.set('view engine', 'ejs');
APP.set('views', path.join(__dirname, 'views'));

// Middleware
APP.use(express.json({ limit: '10mb' }));
APP.use(express.urlencoded({ limit: '10mb', parameterLimit: 50, extended: true }));
APP.use(express.static(path.join(__dirname, 'public')));
APP.use(cookieParser());
APP.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Stel poort in
APP.set('port', process.env.PORT ?? 3000);

// Gebruik API-router
APP.use('/api', APIROUTER);

// Middleware om databaseverbinding te controleren
APP.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Databaseverbinding mislukt:', error);
    res.status(500).send('Databaseverbinding mislukt');
  }
});

// Middleware voor 404-fouten
APP.use((req, res) => {
  res.status(404).json({
    error: 'The specified path does not exist.',
  });
});

// Start de server lokaal (niet op Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  APP.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
  });
}

// Exporteer de app (voor Vercel)
export default APP;
