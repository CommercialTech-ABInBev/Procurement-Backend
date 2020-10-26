import AuthMiddleware from './authMiddleware';
import Permissions from '../util/permissions';

const {
  authenticate, verifyRoles, verifyUser
} = AuthMiddleware;
const {
  user, admins, suppliers
} = Permissions;

const Bouncers = {
  userBouncers: [authenticate, verifyRoles(user)],
  adminBouncers: [authenticate, verifyUser, verifyRoles(admins)],
  supplierBouncers: [authenticate, verifyUser, verifyRoles(suppliers)]
};

export default Bouncers;
