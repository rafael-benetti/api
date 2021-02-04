import ensureAuthentication from '@shared/server/express/middlewares/ensureAuthenticated';
import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';

const profileRoutes = Router();

const profileController = new ProfileController();

profileRoutes.use(ensureAuthentication);

profileRoutes.get('/', profileController.show);

profileRoutes.patch('/', profileController.update);

export default profileRoutes;
