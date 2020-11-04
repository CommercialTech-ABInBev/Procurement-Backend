import { Router } from 'express';
import { Bouncers, NotificationMiddleware } from '../middleware';
import { NotificationController } from '../controller';

const router = Router();
const {
  supplierBouncers
} = Bouncers;
const {
  verifyNotification
} = NotificationMiddleware;
const {
  addNotification,
  getNotifications
} = NotificationController;

router.post('/', supplierBouncers, verifyNotification, addNotification);
router.get('/', supplierBouncers, verifyNotification, getNotifications); // ?id=[]

export default router;
