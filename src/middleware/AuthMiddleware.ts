import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/authService';
import { UnauthorizedError } from '../errors/errors';

class AuthMiddleware {
    authService: AuthService;
    constructor(authService: AuthService) {
        this.authService = authService;
        this.authenticateJWT = this.authenticateJWT.bind(this); // Enlaza el contexto de `this`
    }

    authenticateJWT(req: Request, _res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next(new UnauthorizedError('Token is missing or malformed'));
        }
        const token = authHeader.split(' ')[1];
        try {
            const user = this.authService.verifyJWT(token);
            req['user'] = user;
            next();
        } catch (err) {
            next(err);
        }
    }
}

export default AuthMiddleware;
