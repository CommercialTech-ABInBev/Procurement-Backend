import { Router } from 'express';
import { Bouncers, NotificationMiddleware } from '../middleware';
import { CategoryController } from '../controller';

const router = Router();
const {
  supplierBouncers
} = Bouncers;
const {
  verifyNotification
} = NotificationMiddleware;
const {
    getCategories
} = CategoryController;

router.post('/', supplierBouncers, verifyNotification, getCategories);

export default router;
