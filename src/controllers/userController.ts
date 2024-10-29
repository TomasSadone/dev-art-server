import { BadRequestError } from '../errors/errors';
import MessageResponse from '../types/MessageResponse';
import UserService from '../services/userService';
import { NextFunction, Request, Response } from 'express';

class UserController {
    userService: UserService;
    constructor(UserService: UserService) {
        this.userService = UserService;
    }

    async registerUser(req: Request, res: Response, next: NextFunction) {
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
            next(err);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                throw new BadRequestError(
                    'Username and password must be provided'
                );
            }
            const token = await this.userService.login(username, password);
            res.status(200).json(token);
        } catch (err) {
            next(err);
        }
    }
}

export default UserController;
