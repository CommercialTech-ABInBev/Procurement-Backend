import { Router } from 'express';
import authRoutes from './auth';
import SupplierRoutes from './supplier';
import CategoryRoutes from './category';
import NotificationRoutes from './notification';
import UserRoutes from './user';

const router = Router();

router.use('/auth', authRoutes);
router.use('/supplier', SupplierRoutes);
router.use('/category', CategoryRoutes);
router.use('/notification', NotificationRoutes);
router.use('/staff', UserRoutes);

export default router;
