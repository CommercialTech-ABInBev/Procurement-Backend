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
  getVendorCategory,
  serachCategories,
  serachVendors
} = SupplierController;

router.patch('/profile', userBouncers, verifySupplierProfileUpdate, updateProfile);
router.post('/category', supplierBouncers, verifyCategory, addVendorCategory);
router.get('/category', verifySupplierCategory, getVendorCategory); // ?categortId=[]
router.get('/category/search', serachCategories); //?search=[]
router.get('/vendor/search', serachVendors); //?search=[]

export default router;
