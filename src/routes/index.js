import { Router } from 'express';
import authRoutes from './auth';
import SupplierRoutes from './supplier';

const router = Router();

router.use('/auth', authRoutes);
router.use('/supplier', SupplierRoutes);

export default router;
