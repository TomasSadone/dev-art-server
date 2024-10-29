import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import AppDatabase from './config/db.js';
import UserRepository from './repositories/userRepository.js';
import UserService from './services/userService.js';
import UserController from './controllers/userController.js';
import TemplateRepository from './repositories/templateRepository.js';
import TemplateService from './services/templateService.js';
import TemplateController from './controllers/templateController.js';
import UserRouter from './routes/userRoutes.js';
import errorHandler from './errorHandler/errorHandler.js';
import TemplateRouter from './routes/templateRoutes.js';
import AuthMiddleware from './middleware/AuthMiddleware.js';
import AuthService from './services/authService.js';

dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const app = express();

app.use(cors());

// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

const database = new AppDatabase(DATABASE_URL).getConnection();

const authService = new AuthService(ACCESS_TOKEN_SECRET);
const authMiddleware = new AuthMiddleware(authService);

const userRepository = new UserRepository(database);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const userRouter = new UserRouter(userController);

const templateRepository = new TemplateRepository(database);
const templateService = new TemplateService(templateRepository);
const templateController = new TemplateController(templateService);
const templateRouter = new TemplateRouter(templateController, authMiddleware);

app.use('/user', userRouter.getRouter());
app.use('/templates', templateRouter.getRouter());

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
