import { BadRequestError, ResponseError } from '../errors/errors';
import TemplateService from '../services/templateService';
import { Request, Response, Router } from 'express';
import MessageResponse from '../types/MessageResponse';
const router = Router();

class TemplateController {
    templateService: TemplateService;
    constructor(templateService: TemplateService) {
        this.templateService = templateService;
        router.get('/', this.getAllTemplates.bind(this));
        router.get('/own/:user_id', this.getTemplatesByOwnerId.bind(this));
        router.get('/admin', this.getAdminTemplates.bind(this));
        router.get('template/:template_id', this.getTemplateById.bind(this));
        router.post('/', this.saveTemplate.bind(this));
        router.put('/update', this.updateTemplate.bind(this));
        router.delete('/:template_id/:user_id', this.deleteTemplate.bind(this));
    }

    async getAllTemplates(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
            if (!user_id) {
                throw new BadRequestError('user_id must be provided');
            }
            const templates = await this.templateService.getAllTemplates(
                Number(user_id)
            );
            res.status(200).json(templates);
        } catch (err) {
            this.handleError(res, err);
        }
    }

    async getTemplatesByOwnerId(req: Request, res: Response) {
        try {
            const { user_id } = req.params;
            if (!user_id) {
                throw new BadRequestError('user_id must be provided');
            }
            const templates = await this.templateService.getTemplatesByOwnerId(
                Number(user_id)
            );
            res.status(200).json(templates);
        } catch (err) {
            this.handleError(res, err);
        }
    }

    async getAdminTemplates(_req: Request, res: Response) {
        try {
            const templates = await this.templateService.getAdminTemplates();
            res.status(200).json(templates);
        } catch (err) {
            this.handleError(res, err);
        }
    }

    async getTemplateById(req: Request, res: Response) {
        try {
            const { template_id, user_id } = req.params;
            if (!template_id || !user_id) {
                throw new BadRequestError(
                    'template_id and user_id are required'
                );
            }
            const template = this.templateService.getTemplateById(
                Number(template_id),
                Number(user_id)
            );
            res.status(200).json(template);
        } catch (err) {
            this.handleError(res, err);
        }
    }

    async saveTemplate(req: Request, res: Response) {
        try {
            const { template } = req.body;
            if (
                !template ||
                !template.id ||
                !template.json ||
                !template.owner_id
            ) {
                throw new BadRequestError(
                    "Template and it's id, json, and owner_id must be provided"
                );
            }
            await this.templateService.saveTemplate(template);
            res.status(200).json(
                new MessageResponse('Template saved successfully')
            );
        } catch (err) {
            this.handleError(res, err);
        }
    }

    async updateTemplate(req: Request, res: Response) {
        try {
            const { template, user_id } = req.body;
            if (!user_id || !template || !template.id || !template.json) {
                throw new BadRequestError(
                    "user_id, Template and it's id, and json, must be provided"
                );
            }
            await this.templateService.updateTemplate(
                template.id,
                template.json,
                user_id
            );
            res.status(200).json(
                new MessageResponse('Template updated successfully')
            );
        } catch (err) {
            this.handleError(res, err);
        }
    }

    async deleteTemplate(req: Request, res: Response) {
        try {
            const { template_id, user_id } = req.params;
            if (!user_id || !template_id) {
                throw new BadRequestError(
                    'user_id and template_id must be provided'
                );
            }
            await this.templateService.deleteTemplate(
                Number(template_id),
                Number(user_id)
            );
            res.status(200).json(
                new MessageResponse('Template deleted successfully')
            );
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

const createTemplateController = (templateService: TemplateService) => {
    new TemplateController(templateService);
    return router;
};
