import { Router } from 'express';
import { Bouncers, SupplierMiddleware } from '../middleware';
import { SupplierController } from '../controller';

const router = Router();
const {
  supplierBouncers, userBouncers
} = Bouncers;
const {
  verifySupplierProfileUpdate,
  verifyCategory,
  verifySupplierCategory
} = SupplierMiddleware;
const {
  updateProfile,
  addVendorCategory,
  getVendorCategory
} = SupplierController;

router.patch('/profile', userBouncers, verifySupplierProfileUpdate, updateProfile);
router.post('/category', supplierBouncers, verifyCategory, addVendorCategory);
router.get('/category', userBouncers, verifySupplierCategory, getVendorCategory);

export default router;
