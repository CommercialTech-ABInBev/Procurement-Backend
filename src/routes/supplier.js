import { Router } from 'express';
import { Bouncers, SupplierMiddleware } from '../middleware';
import { SupplierController } from '../controller';

const router = Router();
const {
  supplierBouncers,
} = Bouncers;
const {
  verifySupplierProfileUpdate
} = SupplierMiddleware;
const {
  updateProfile
} = SupplierController;

router.post('/profile', verifySupplierProfileUpdate, updateProfile);

export default router;
