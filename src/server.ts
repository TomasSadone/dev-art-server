import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import AppDatabase from './config/db.js';
import UserRepository from './repositories/userRepository.js';
import UserService from './services/userService.js';
import { createUserController } from './controllers/userController.js';
import TemplateRepository from './repositories/templateRepository.js';
import TemplateService from './services/templateService.js';
import { createTemplateController } from './controllers/templateController.js';

dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

app.use(cors());

// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

const database = new AppDatabase(DATABASE_URL).getConnection();

const userRepository = new UserRepository(database);
const userService = new UserService(userRepository);
const userController = createUserController(userService);

const templateRepository = new TemplateRepository(database);
const templateService = new TemplateService(templateRepository);
const templateController = createTemplateController(templateService);

app.use('/user', userController);
app.use('/templates', templateController);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
