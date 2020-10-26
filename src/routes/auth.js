import { Router } from 'express';
import { AuthMiddleware } from '../middleware';
import { AuthController } from '../controller';
// import { Permissions } from '../util';

const router = Router();
const {
  verifySignup,
  verifyLogin
} = AuthMiddleware;
const {
  signup,
} = AuthController;
// const {
// } = Permissions;

router.post('/signup/check', verifySignup);
router.post('/signup', verifySignup, signup);
router.post('/login', verifyLogin, login);

export default router;
