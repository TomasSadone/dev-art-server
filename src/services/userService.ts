import { compare, hash } from 'bcrypt';
import UserRepository from '../repositories/userRepository';
import {
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from '../errors/errors';
import type { User, UserRole } from '../types/User';

class UserService {
    userRepository: UserRepository;
    constructor(UserRepository: UserRepository) {
        this.userRepository = UserRepository;
    }

    async getUserByUsername(username: string) {
        const user = await this.userRepository.getUserByUsername(username);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    async registerUser(username: string, password: string, role: UserRole) {
        try {
            const existingUser = await this.getUserByUsername(username);
            if (existingUser) {
                throw new ConflictError('Username is already registered');
            }
        } catch (err) {
            if (err.statusCode === 404) {
                const hashedPassword = await hash(password, 10);
                await this.userRepository.registerUser(
                    username,
                    hashedPassword,
                    role
                );
            } else {
                throw err;
            }
        }
    }

    async login(username: string, password: string): Promise<User> {
        const user = await this.getUserByUsername(username);
        const match = await compare(password, user.password);
        console.log(match);
        if (!match) {
            throw new UnauthorizedError('Password is incorrect');
        }
        return user;
    }
}

export default UserService;