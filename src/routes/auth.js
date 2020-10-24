import { Router } from 'express';
import { AuthMiddleware } from '../middleware';
import { AuthController } from '../controller';
// import { Permissions } from '../util';

const router = Router();
const {
  verifySignup,
} = AuthMiddleware;
const {
  signup,
} = AuthController;
// const {
// } = Permissions;

router.post('/signup', verifySignup, signup);

export default router;
