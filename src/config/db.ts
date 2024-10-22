import sqlite3Pkg, { Database, sqlite3 } from 'sqlite3';
const sqlite3 = sqlite3Pkg.verbose();

class AppDatabase {
    db: Database;
    constructor() {
        this.db = new sqlite3.Database('dev-art-database.db', (err) => {
            if (err) {
                console.log('Error connecting to the database: ', err);
            } else {
                this.initializeTables();
                console.log('Database connected succesfully');
            }
        });
    }

    private initializeTables() {
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            )`);

            this.db.run(`CREATE TABLE IF NOT EXISTS templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                owner_id INTEGER NOT NULL,
                json TEXT NOT NULL,
                FOREIGN KEY(owner_id) REFERENCES users(id)
                )`);
        });
    }

    getConnection() {
        return this.db;
    }
}

export default AppDatabase;
