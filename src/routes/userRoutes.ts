import { Router } from 'express';
import UserController from '../controllers/userController';

class UserRouter {
    userController: UserController;
    router: Router;
    constructor(userController: UserController) {
        this.userController = userController;
        this.router = Router();
        this.router.post(
            '/register',
            this.userController.registerUser.bind(this.userController)
        );
        this.router.post(
            '/login',
            this.userController.login.bind(this.userController)
        );
    }
    getRouter() {
        return this.router;
    }
}

export default UserRouter;
