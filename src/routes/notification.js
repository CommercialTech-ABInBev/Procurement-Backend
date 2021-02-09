import { Router } from 'express';
import { Bouncers, NotificationMiddleware } from '../middleware';
import { NotificationController } from '../controller';

const router = Router();
const {
  supplierBouncers, adminBouncers
} = Bouncers;
const {
  verifyNotification
} = NotificationMiddleware;
const {
  addNotification,
  getNotifications,
  deleteNotification,
  adminReplySubject,
  vendorReplySubject
} = NotificationController;

router.post('/', supplierBouncers, verifyNotification, addNotification);
router.post('/admin/reply', adminBouncers, verifyNotification, adminReplySubject); // ?subject=[]&vendorId=[]
router.post('/vendor/reply', supplierBouncers, verifyNotification, vendorReplySubject); // ?subject=[]
router.get('/', supplierBouncers, verifyNotification, getNotifications); // ?subjectId=[]
router.delete('/', supplierBouncers, verifyNotification, deleteNotification); // ?id=[]

export default router;
