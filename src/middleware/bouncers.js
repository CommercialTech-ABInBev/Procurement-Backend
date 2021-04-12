import AuthMiddleware from './authMiddleware';
import Permissions from '../util/permissions';

const {
  authenticate, verifyRoles, verifyUser
} = AuthMiddleware;
const {
  user, admins, suppliers, super_admin
} = Permissions;

const Bouncers = {
  userBouncers: [authenticate, verifyRoles(user)],
  adminBouncers: [authenticate, verifyRoles(admins)],
  // adminBouncers: [authenticate, verifyUser, verifyRoles(admins)],
  supplierBouncers: [authenticate, verifyRoles(suppliers)],
  superAdminBouncers: [authenticate, verifyRoles(super_admin)]
};

export default Bouncers;
