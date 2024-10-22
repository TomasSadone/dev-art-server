import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import AppDatabase from './config/db.js';
import UserRepository from './repositories/userRepository.js';
import UserService from './services/userService.js';
import { createUserController } from './controllers/userController.js';

const PORT = process.env.PORT;

dotenv.config();

const app = express();

app.use(cors());

// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

const database = new AppDatabase().getConnection();

const userRepository = new UserRepository(database);
const userService = new UserService(userRepository);
const userController = createUserController(userService);

app.use('/user', userController);

app.listen(3000, () => {
    console.log(`server running on port ${PORT}`);
});
