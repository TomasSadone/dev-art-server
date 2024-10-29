import { BadRequestError, UnauthorizedError } from '../errors/errors';
import TemplateService from '../services/templateService';
import { NextFunction, Request, Response } from 'express';
import MessageResponse from '../types/MessageResponse';

class TemplateController {
    templateService: TemplateService;
    constructor(templateService: TemplateService) {
        this.templateService = templateService;
    }

    async getAdminTemplates(_req: Request, res: Response, next: NextFunction) {
        try {
            const templates = await this.templateService.getAdminTemplates();
            res.status(200).json(templates);
        } catch (err) {
            next(err);
        }
    }

    async getAllTemplates(req: Request, res: Response, next: NextFunction) {
        try {
            const user = this.getReqUser(req);
            const templates = await this.templateService.getAllTemplates(
                Number(user.id)
            );
            res.status(200).json(templates);
        } catch (err) {
            next(err);
        }
    }

    async getTemplatesByOwnerId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = this.getReqUser(req);
            const templates = await this.templateService.getTemplatesByOwnerId(
                Number(user.id)
            );
            res.status(200).json(templates);
        } catch (err) {
            next(err);
        }
    }

    async getTemplateById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = this.getReqUser(req);
            const { template_id } = req.params;
            if (!template_id) {
                throw new BadRequestError('template_id is required');
            }
            const template = await this.templateService.getTemplateById(
                Number(template_id),
                Number(user.id)
            );
            res.status(200).json(template);
        } catch (err) {
            next(err);
        }
    }

    async saveTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const user = this.getReqUser(req);
            const { template } = req.body;
            if (!template || !template.json) {
                throw new BadRequestError(
                    "Template and it's json must be provided"
                );
            }
            await this.templateService.saveTemplate(template.json, user.id);
            res.status(200).json(
                new MessageResponse('Template saved successfully')
            );
        } catch (err) {
            next(err);
        }
    }

    async updateTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const user = this.getReqUser(req);
            const { template } = req.body;
            if (!template || !template.id || !template.json) {
                throw new BadRequestError(
                    'A template with id and json must be provided'
                );
            }
            await this.templateService.updateTemplate(template, user.id);
            res.status(200).json(
                new MessageResponse('Template updated successfully')
            );
        } catch (err) {
            next(err);
        }
    }

    async deleteTemplate(req: Request, res: Response, next: NextFunction) {
        try {
            const user = this.getReqUser(req);

            const { template_id } = req.params;
            if (!template_id) {
                throw new BadRequestError('template_id must be provided');
            }
            await this.templateService.deleteTemplate(
                Number(template_id),
                Number(user.id)
            );
            res.status(200).json(
                new MessageResponse('Template deleted successfully')
            );
        } catch (err) {
            next(err);
        }
    }
    getReqUser(req: Request) {
        const user = req['user'];
        if (!user) {
            throw new UnauthorizedError('Unauthorized to perform this action');
        }
        return user;
    }
}

export default TemplateController;
