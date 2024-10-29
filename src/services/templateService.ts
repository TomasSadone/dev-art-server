import { NotFoundError, UnauthorizedError } from '../errors/errors';
import TemplateRepository from '../repositories/templateRepository';
import type { Template } from '../types/Template';
import { User } from '../types/User';

class TemplateService {
    templateRepository: TemplateRepository;
    constructor(templateRepository: TemplateRepository) {
        this.templateRepository = templateRepository;
    }

    async getAllTemplates(id: User['id']): Promise<Template[]> {
        const templates = await this.templateRepository.getAllTemplates(id);
        return templates;
    }

    async getTemplatesByOwnerId(id: User['id']) {
        const templates = await this.templateRepository.getTemplatesByOwnerId(
            id
        );
        return templates;
    }

    async getAdminTemplates() {
        const templates = await this.templateRepository.getTemplatesByOwnerId(
            1
        );
        return templates;
    }

    async getTemplateById(id: Template['id'], owner_id: User['id']) {
        const template = await this.templateRepository.getTemplateById(id);
        if (!template) {
            throw new NotFoundError('Template was not found');
        }
        const isAdminRequest = owner_id === 1;
        const isAdminTemplate = template.owner_id === 1;
        if (!isAdminRequest && !isAdminTemplate) {
            console.log(owner_id, 'owner_id');
            console.log(template.owner_id, 'template.owner_id');
            if (
                template.owner_id !== owner_id
                // con template visibility: !template.public && template.owner-id !== usr_id
            ) {
                throw new UnauthorizedError(
                    "You don't have permission to access this template"
                );
            }
        }

        return template;
    }

    async saveTemplate(template_json: Template['json'], user_id: User['id']) {
        const template = { json: template_json, owner_id: user_id };
        await this.templateRepository.saveTemplate(template);
    }

    async updateTemplate(req_template: Template, user_id: User['id']) {
        await this.getTemplateById(req_template.id, user_id);
        await this.templateRepository.updateTemplate(
            req_template.id,
            req_template.json
        );
    }

    async deleteTemplate(template_id: Template['id'], owner_id: User['id']) {
        await this.getTemplateById(template_id, owner_id);
        await this.templateRepository.deleteTemplate(template_id);
    }
}

export default TemplateService;
