import { Router } from 'express';
import { Bouncers } from '../middleware';
import { UserController } from '../controller';

const router = Router();
const {
  userBouncers, superAdminBouncers
} = Bouncers;
const {
  registerVendor,
  addJob,
  getJobFunction,
  getVendorRequest
} = UserController;

router.post('/register', userBouncers, registerVendor);
router.post('/jobs', userBouncers, addJob);
router.get('/jobs', userBouncers, getJobFunction);
router.get('/vendor/requests', superAdminBouncers, getVendorRequest);

export default router;
