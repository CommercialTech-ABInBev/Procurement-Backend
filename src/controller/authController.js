/* eslint-disable no-unused-vars */
import { GeneralService } from '../services';
import { Toolbox } from '../util';
import database from '../models';
// import { env } from '../config';

const {
  successResponse,
  errorResponse,
  createToken,
  hashPassword,
  comparePassword,
  verifyToken,
} = Toolbox;
// const {
//   sendVerificationEmail,
//   sendPasswordResetEmail
// } = Mailer;
const {
  addEntity,
  updateByKey,
  findByKey
} = GeneralService;
const {
  User,
  RoleUser,
  Role
} = database;
// const {
//   ADMIN_KEY,
//   CLIENT_URL
// } = env;

const AuthController = {
  /**
   * user signup
   * @async
   * @param {object} req
   * @param {object} res
   * @returns {JSON} a JSON response with user details and Token
   * @memberof AuthController
   */
  async signup(req, res) {
    try {
      const body = {
        email: req.body.email,
        password: hashPassword(req.body.password),
        supplier: req.body.supplier,
      };
      const user = await addEntity(User, { ...body });
      let role;
      let roleUser;
      if (req.body.supplier) {
        role = await findByKey(Role, { role: 'supplier' });
        roleUser = await addEntity(RoleUser, { userId: user.id, roleId: role.id });
      } else {
        role = await findByKey(Role, { role: 'staff' });
        roleUser = await addEntity(RoleUser, { userId: user.id, roleId: role.id });
      }

      user.token = createToken({
        email: user.email,
        id: user.id,
        roleId: roleUser.roleId,
        verified: user.verified
      });
      res.cookie('token', user.token, { maxAge: 70000000, httpOnly: true });
      return successResponse(res, { user, roleUser }, 201);
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default AuthController;
