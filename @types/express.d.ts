import type { Request } from 'express';
import { sqlite3 } from 'sqlite3';

declare global {
    namespace Express {
        interface Request {
            db: sqlite3.Database;
        }
    }
}
