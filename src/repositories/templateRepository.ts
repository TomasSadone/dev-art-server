import AppDatabase from '../config/db';
import { InternalServerError } from '../errors/errors';
import { Template } from '../types/Template';
import { User } from '../types/User';

class TemplateRepository {
    databaseConnection: AppDatabase['db'];

    constructor(databaseConnection: AppDatabase['db']) {
        this.databaseConnection = databaseConnection;
    }

    async getAllTemplates(id: User['id']): Promise<Template[]> {
        return new Promise((resolve, reject) => {
            this.databaseConnection.all(
                'SELECT * FROM templates WHERE owner_id = 1 OR owner_id = ?',
                [id],
                (err, rows: Template[]) => {
                    if (err) {
                        console.log('ERROR RUNNING QUERY:', err);
                        reject(
                            new InternalServerError(
                                'Error accesing database templates'
                            )
                        );
                    }
                    resolve(rows);
                }
            );
        });
    }

    async getTemplatesByOwnerId(id: User['id']): Promise<Template[]> {
        return new Promise((resolve, reject) => {
            this.databaseConnection.all(
                'SELECT * FROM templates WHERE owner_id = ?',
                [id],
                (err, rows: Template[]) => {
                    if (err) {
                        console.log('ERROR RUNNING QUERY:', err);
                        reject(
                            new InternalServerError(
                                'Error accesing database templates'
                            )
                        );
                    }
                    resolve(rows);
                }
            );
        });
    }

    async getTemplateById(id: number): Promise<Template> {
        return new Promise((resolve, reject) => {
            this.databaseConnection.get(
                'SELECT * FROM templates WHERE id = ?',
                [id],
                (err, row: Template) => {
                    if (err) {
                        console.log('ERROR RUNNING QUERY:', err);
                        reject(
                            new InternalServerError(
                                'Error accesing database template'
                            )
                        );
                    }
                    resolve(row);
                }
            );
        });
    }

    saveTemplate(template: Template): Promise<void> {
        return new Promise((resolve, reject) => {
            this.databaseConnection.run(
                'INSERT INTO templates (owner_id, json) VALUES (?, ?)',
                [template.owner_id, template.json],
                function (err) {
                    if (err) {
                        console.log('ERROR RUNNING QUERY:', err);
                        reject(
                            new InternalServerError(
                                'Error saving template to database'
                            )
                        );
                    }
                    resolve();
                }
            );
        });
    }

    deleteTemplate(template_id: Template['id']): Promise<void> {
        return new Promise((resolve, reject) => {
            this.databaseConnection.run(
                'DELETE FROM templates WHERE id = ?',
                [template_id],
                function (err) {
                    if (err) {
                        console.log('ERROR RUNNING QUERY:', err);
                        reject(
                            new InternalServerError(
                                'Error deleting template from database'
                            )
                        );
                    }
                    resolve();
                }
            );
        });
    }

    updateTemplate(id: Template['id'], json: Template['json']): Promise<void> {
        return new Promise((resolve, reject) => {
            this.databaseConnection.run(
                'UPDATE templates SET json = ? WHERE id = ?',
                [json, id],
                function (err) {
                    if (err) {
                        console.log('ERROR RUNNING QUERY:', err);
                        reject(
                            new InternalServerError(
                                'Error updating template in database'
                            )
                        );
                    }
                    resolve();
                }
            );
        });
    }
}

export default TemplateRepository;
