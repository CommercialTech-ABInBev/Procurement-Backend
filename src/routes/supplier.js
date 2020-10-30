import { Router } from 'express';
import { Bouncers, SupplierMiddleware } from '../middleware';
import { SupplierController } from '../controller';

const router = Router();
const {
  supplierBouncers, userBouncers
} = Bouncers;
const {
  verifySupplierProfileUpdate,
  verifyCategory
} = SupplierMiddleware;
const {
  updateProfile,
  addVendorCategory
} = SupplierController;

router.patch('/profile', userBouncers, verifySupplierProfileUpdate, updateProfile);
router.post('/category', supplierBouncers, verifyCategory, addVendorCategory);

export default router;
