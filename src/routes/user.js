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
  addJobs,
  getJobFunction,
  getVendorRequest,
  updateVendorRegistrationRequest
} = UserController;

router.post('/register', userBouncers, registerVendor);
router.post('/jobs', userBouncers, addJob);
router.post('/jobs/all', userBouncers, addJobs);
router.get('/jobs', userBouncers, getJobFunction);
router.get('/vendor/requests', superAdminBouncers, getVendorRequest);
router.patch('/vendor/requests', superAdminBouncers, updateVendorRegistrationRequest); // ?requestId=[]&approvalStatus=[]

export default router;
