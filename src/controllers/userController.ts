import { BadRequestError, ResponseError } from '../errors/errors';
import MessageResponse from '../types/MessageResponse';
import UserService from '../services/userService';
import express, { Request, Response } from 'express';
const router = express.Router();

class UserController {
    userService: UserService;
    constructor(UserService: UserService) {
        this.userService = UserService;
        router.post('/register', this.registerUser.bind(this));
        router.post('/login', this.login.bind(this));
    }

    async registerUser(req: Request, res: Response) {
        try {
            const { username, password, role = 'client' } = req.body;
            if (!username || !password) {
                throw new BadRequestError(
                    'Username and password must be provided'
                );
            }
            await this.userService.registerUser(username, password, role);
            res.status(200).json(
                new MessageResponse(`User ${username} successfully registered`)
            );
        } catch (err) {
            this.handleError(res, err);
        }
    }

    async login(req: Request, res: Response) {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new BadRequestError('Username and password must be provided');
        }
        try {
            const user = await this.userService.login(username, password);
            res.status(200).json(user);
        } catch (err) {
            this.handleError(res, err);
        }
    }

    handleError(res: Response, err: ResponseError) {
        console.log('ERROR', err);
        const status = err?.statusCode || 500;
        const message = err?.message || 'Internal server error';
        res.status(status).json(new MessageResponse(message));
    }
}

const createUserController = (userService: UserService) => {
    new UserController(userService);
    return router;
};

export { createUserController };
