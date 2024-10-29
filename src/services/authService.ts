import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/errors';

class AuthService {
    constructor(private readonly secretKey: string) {}

    verifyJWT(token: string) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (err) {
            throw new UnauthorizedError('Invalid token');
        }
    }
}

export default AuthService;
