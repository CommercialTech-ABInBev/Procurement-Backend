import joi from '@hapi/joi';
import { Permissions } from '../util';

const { user } = Permissions;

export const superAdminSchema = joi.object().keys({
  adminKey: joi.string().required()
    .label('Admin key must be a string'),
});

export const rolesSchema = joi.object().keys({
  roleId: joi.number().positive().valid(user).required()
    .label('Please enter a valid role id'),
  email: joi.string().email().required()
    .label('Please enter a valid email address')
});
