import { Router } from 'express';
import { Bouncers, SupplierMiddleware, AuthMiddleware } from '../middleware';
import { SupplierController } from '../controller';

const router = Router();
const {
  supplierBouncers, userBouncers, adminBouncers
} = Bouncers;
const {
  verifySupplierProfileUpdate,
  verifyCategory,
  verifySupplierCategory,
  verifyApproval
} = SupplierMiddleware;
const {
  authenticate
} = AuthMiddleware;
const {
  updateProfile,
  addVendorCategory,
  getVendor,
  serachCategories,
  serachVendors,
  updateVendorStatus,
  getProfile
} = SupplierController;

router.patch('/profile', userBouncers, verifySupplierProfileUpdate, updateProfile);
router.post('/category', supplierBouncers, verifyCategory, addVendorCategory);
router.get('/', authenticate, verifySupplierCategory, getVendor); // ?categortId=[]&id=[]
router.get('/me', authenticate, getProfile); // ?categortId=[]&id=[]
router.get('/category/search', authenticate, serachCategories); //?search=[]
router.get('/vendor/search', authenticate, serachVendors); //?search=[]
router.patch('/approve', authenticate, verifyApproval, updateVendorStatus); //?approvalStatus=[]

export default router;
