import TemplateService from '../services/templateService';

class TemplateController {
    templateService: TemplateService;
    constructor(templateService: TemplateService) {
        this.templateService = templateService;
    }
}
