import { Database } from 'sqlite3';
import { InternalServerError } from '../errors/errors';
import type { User, UserRole } from '../types/User';
import AppDatabase from '../config/db';

class UserRepository {
    databaseConnection: AppDatabase['db'];
    constructor(databaseConnection: AppDatabase['db']) {
        this.databaseConnection = databaseConnection;
    }

    async getUserByUsername(username: string): Promise<User | undefined> {
        return new Promise((resolve, reject) => {
            this.databaseConnection.get(
                `SELECT * FROM users WHERE username = ?`,
                username,
                (err, row: User | undefined) => {
                    if (err) {
                        console.log('ERROR RUNNING QUERY:', err);
                        reject(
                            new InternalServerError(
                                'Database error getting user'
                            )
                        );
                    }
                    resolve(row);
                }
            );
        });
    }

    async registerUser(username: string, password: string, role: UserRole) {
        return new Promise((resolve, reject) => {
            this.databaseConnection.run(
                'INSERT INTO users (username, password, role) values (?, ?, ?)',
                [username, password, role],
                function (err) {
                    if (err) {
                        console.log('ERROR RUNNING QUERY:', err);
                        reject(
                            new InternalServerError(
                                'Database error writing user'
                            )
                        );
                    }

                    resolve(this.lastID);
                }
            );
        });
    }
}

export default UserRepository;
