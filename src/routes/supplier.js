import { Router } from 'express';
import { Bouncers, SupplierMiddleware } from '../middleware';
import { SupplierController } from '../controller';

const router = Router();
const {
  supplierBouncers, userBouncers
} = Bouncers;
const {
  verifySupplierProfileUpdate
} = SupplierMiddleware;
const {
  updateProfile
} = SupplierController;

router.patch('/profile', userBouncers, verifySupplierProfileUpdate, updateProfile);

export default router;
