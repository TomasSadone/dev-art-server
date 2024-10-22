import { NotFoundError, UnauthorizedError } from '../errors/errors';
import TemplateRepository from '../repositories/templateRepository';
import type { Template } from '../types/Template';
import { User } from '../types/User';

class TemplateService {
    templateRepository: TemplateRepository;
    constructor(templateRepository: TemplateRepository) {
        this.templateRepository = templateRepository;
    }

    async getTemplatesByOwnerId(id: User['id']) {
        const templates = await this.templateRepository.getTemplatesByOwnerId(
            id
        );
        return templates;
    }

    async getAdminTemplates() {
        const templates = await this.templateRepository.getTemplateById(1);
        return templates;
    }

    async getTemplateById(id: Template['id'], user_id: User['id']) {
        const template = await this.templateRepository.getTemplateById(id);
        if (!template) {
            throw new NotFoundError('Template to delete was not found');
        }
        if (
            template.owner_id !== user_id
            // con template visibility: !template.public && template.owner-id !== usr_id
        ) {
            throw new UnauthorizedError(
                "You don't have permission to access this template"
            );
        }

        return template;
    }

    async saveTemplate(template: Template) {
        await this.templateRepository.saveTemplate(template);
    }

    async updateTemplate(
        id: Template['id'],
        json: Template['json'],
        user_id: User['id']
    ) {
        await this.getTemplateById(id, user_id);
        await this.templateRepository.updateTemplate(id, json);
    }

    async deleteTemplate(template_id: Template['id'], user_id: User['id']) {
        await this.getTemplateById(template_id, user_id);
        await this.templateRepository.deleteTemplate(template_id);
    }
}

export default TemplateService;
