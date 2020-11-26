import { Router } from 'express';
import { AuthMiddleware, Bouncers } from '../middleware';
import { AuthController } from '../controller';

const router = Router();
const {
  verifySignup,
  verifySupplierSignup,
  verifyLogin,
  authenticate,
  verifyPasswordReset,
  verifyInactiveUser
} = AuthMiddleware;
const {
  userBouncers, adminBouncers
} = Bouncers;
const {
  signup,
  login,
  getProfile,
  resetPassword,
  resetPasswordEmailLink,
  verifyResetPasswordLink,
  setPassword,
  logoutUser,
  verifyEmail,
  resendEmailVerificationLink,
  deactivateUsers
} = AuthController;

router.post('/signup/check', verifySignup);
router.post('/signup', verifySignup, signup);
router.post('/signup/supplier/check', verifySupplierSignup);
router.post('/signup/supplier', verifySupplierSignup, signup);
router.post('/login', verifyLogin, login);
router.get('/verify', verifyEmail);
router.post('/resend-verification/email', resendEmailVerificationLink);
router.get('/profile', userBouncers, getProfile);
router.post('/reset-password', authenticate, verifyPasswordReset, resetPassword);
router.post('/reset-password/email', verifyPasswordReset, resetPasswordEmailLink);
router.get('/reset-password/email', verifyResetPasswordLink);
router.post('/set-password', authenticate, verifyPasswordReset, setPassword);
router.post('/logout', authenticate, logoutUser);
router.delete('/deactivate', adminBouncers, verifyInactiveUser, deactivateUsers);//email=[]&id=[]&vendorId=[]

export default router;
