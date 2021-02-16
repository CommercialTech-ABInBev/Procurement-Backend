import { Router } from 'express';
import { Bouncers } from '../middleware';
import { UserController } from '../controller';

const router = Router();
const {
  userBouncers
} = Bouncers;
const {
  registerVendor,
  addJob,
  getJobFunction
} = UserController;

router.post('/register', userBouncers, registerVendor);
router.post('/jobs', userBouncers, addJob);
router.get('/jobs', userBouncers, getJobFunction);

export default router;
