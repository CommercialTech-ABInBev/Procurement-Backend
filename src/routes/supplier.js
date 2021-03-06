import { Router } from 'express';
import { Bouncers, SupplierMiddleware, AuthMiddleware } from '../middleware';
import { SupplierController } from '../controller';
import upload from '../middleware/uploadMiddleware';

const router = Router();
const {
  supplierBouncers, userBouncers, adminBouncers
} = Bouncers;
const {
  verifySupplierProfileUpdate,
  verifyCategory,
  verifySupplierCategory,
  verifyApproval,
  verifyVendors
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
  getProfile,
  updateLogo,
  deleteImage,
  getVendorBySubcategory,
  submitForApproval,
  getSimilarVendors,
  addVendorIds,
  serachSubCategories,
  search
} = SupplierController;

router.patch('/profile', userBouncers, upload.array('file'), verifySupplierProfileUpdate, updateProfile);
router.patch('/logo', userBouncers, upload.array('file'), updateLogo);
router.delete('/image', userBouncers, deleteImage); // ?id=[]
router.post('/category', supplierBouncers, verifyCategory, addVendorCategory);
router.get('/', authenticate, verifySupplierCategory, getVendor); // ?categortId=[]&id=[]
router.get('/similar', authenticate, getSimilarVendors); // ?similarVendors=[]&vendorId=[]
router.post('/subcategory', authenticate, getVendorBySubcategory);
router.post('/location', authenticate, getVendorBySubcategory);
router.get('/me', authenticate, getProfile); // ?categortId=[]&id=[]
router.get('/category/search', authenticate, serachCategories); // ?search=[]
router.get('/vendor/search', authenticate, serachVendors); // ?search=[]
router.get('/subCategory/search', authenticate, serachSubCategories); // ?search=[]
// router.get('/subCategory/search', authenticate, serachSubCategories); // ?search=[]
router.get('/search', authenticate, search); // ?search=[]
router.patch('/approve', authenticate, verifyApproval, updateVendorStatus); // ?approvalStatus=[]
router.post('/submit', authenticate, submitForApproval);
router.post('/vendors', adminBouncers, verifyVendors, addVendorIds);

export default router;
