import { Router } from 'express';
import { Bouncers, SupplierMiddleware } from '../middleware';
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
router.get('/', verifySupplierCategory, getVendor); // ?categortId=[]&id=[]
router.get('/me', getProfile); // ?categortId=[]&id=[]
router.get('/category/search', serachCategories); //?search=[]
router.get('/vendor/search', serachVendors); //?search=[]
router.patch('/approve', verifyApproval, updateVendorStatus); //?approvalStatus=[]

export default router;
