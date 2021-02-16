import { Router } from 'express';
import { Bouncers } from '../middleware';
import { UserController } from '../controller';

const router = Router();
const {
  userBouncers
} = Bouncers;
const {
  registerVendor
} = UserController;

router.get('/', userBouncers, registerVendor);

export default router;
