import joi from '@hapi/joi';
import passwordComplexity from 'joi-password-complexity';

// password complexity object
const complexityOptions = {
  min: 8,
  max: 250,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 3,
};

const AuthValidation = {
  /**
   * validate user parameters during signup
   * @function
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof AuthValidation
   */
  validateSignup(payload) {
    const schema = {
      firstName: joi.string().min(3).max(25).required()
        .label('Please enter a valid firstname \n the field must not be empty and it must be more than 2 letters'),
      lastName: joi.string().min(3).max(25).required()
        .label('Please enter a valid lastname \n the field must not be empty and it must be more than 2 letters'),
      email: joi.string().email().required()
        .label('Please enter a valid email address'),
      userName: joi.string().min(3).max(15).regex(/^[a-zA-Z0-9_]{3,30}$/)
        .required()
        .label('Please input a valid userName \n It must only contain alphabets and/underscore ("-")'),
      password: new passwordComplexity(complexityOptions).required()
        .label('Password is required. \n It should be more than 8 characters, and should include at least a capital letter, and a number'),
      supplier: joi.bool(),
      companyTheme: joi.string().regex(/^#[A-Fa-f0-9]{6}$/).label('colour nust be a Hex in format #ffffff'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate user parameters during login
   * @function
   * @param {object} payload - user object
   * @returns {boolean | object} - returns a boolean or an error object
   * @memberof AuthValidation
   */
  validateLogin(payload) {
    const schema = {
      usernameOrEmail: joi.string().min(3).max(50).required()
        .label('incorrect username or email'),
      password: new passwordComplexity(complexityOptions).required()
        .label('incorrect password or email')
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },
  /**
   * validate username credentials
   * @function
   * @param {object} payload - user object
   * @returns {boolean | object} - returns a boolean or an error object
   * @memberof AuthValidation
   */
  validateUsername(payload) {
    const schema = {
      userName: joi.string().min(3).max(15).regex(/^[a-zA-Z0-9_]{3,30}$/)
        .required()
        .label('Please input a valid userName \n It must only contain alphabets and/underscore ("-")'),
      change: joi.bool(),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },
};

export default AuthValidation;
