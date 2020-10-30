import { Router } from 'express';
import authRoutes from './auth';
import SupplierRoutes from './supplier';
import CategoryRoutes from './category';

const router = Router();

router.use('/auth', authRoutes);
router.use('/supplier', SupplierRoutes);
router.use('/category', CategoryRoutes);

export default router;
