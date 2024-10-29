import { Router } from 'express';
import TemplateController from '../controllers/templateController';
import AuthMiddleware from '../middleware/AuthMiddleware';

class TemplateRouter {
    templateController: TemplateController;
    authMiddleware: AuthMiddleware;
    router: Router;
    constructor(
        templateController: TemplateController,
        authMiddleware: AuthMiddleware
    ) {
        this.templateController = templateController;
        this.authMiddleware = authMiddleware;
        this.router = Router();
        this.router.get(
            '/admin',
            this.templateController.getAdminTemplates.bind(
                this.templateController
            )
        );
        this.router.get(
            '/all',
            this.authMiddleware.authenticateJWT,
            this.templateController.getAllTemplates.bind(
                this.templateController
            )
        );
        this.router.get(
            '/own',
            this.authMiddleware.authenticateJWT,
            this.templateController.getTemplatesByOwnerId.bind(
                this.templateController
            )
        );

        this.router.get(
            '/template/:template_id',
            this.authMiddleware.authenticateJWT,
            this.templateController.getTemplateById.bind(
                this.templateController
            )
        );
        this.router.post(
            '/',
            this.authMiddleware.authenticateJWT,
            this.templateController.saveTemplate.bind(this.templateController)
        );
        this.router.put(
            '/update',
            this.authMiddleware.authenticateJWT,
            this.templateController.updateTemplate.bind(this.templateController)
        );
        this.router.delete(
            '/:template_id',
            this.authMiddleware.authenticateJWT,
            this.templateController.deleteTemplate.bind(this.templateController)
        );
    }
    getRouter() {
        return this.router;
    }
}

export default TemplateRouter;
