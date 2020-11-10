import joi from '@hapi/joi';
// import validationData from './validationData';

// const { states, paystackBankNamesAndCodes } = validationData;

const GeneralValidation = {
  /**
   * validate general parameters
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateParameters(payload) {
    // const bankNames = paystackBankNamesAndCodes.map((item) => item.bankName);
    const schema = {
      email: joi.string().email()
        .label('Please enter a valid email address'),
      approvalStatus: joi.string().valid('pending', 'approved', 'rejected').label('parameter must be approved/rejected'),
      id: joi.number().positive()
        .label('id parameter must be a positive number'),
      vendorId: joi.string().label('id parameter must be a positive number'),
      categoryId: joi.number().positive()
        .label('id parameter must be a positive number'),
      userId: joi.number().positive()
        .label('id parameter must be a positive number'),
      name: joi.string().min(3).max(30)
        .label('Please enter a valid name \n the field must not be empty and it must be more than 2 letters'),
      subject: joi.string().min(1).max(50)
        .label('Please enter a valid subject'),
      location: joi.string().min(1).max(50)
        .label('Please enter a valid subject'),
      userName: joi.string().regex(/^[a-zA-Z0-9_]{3,30}$/)
        .label('Please input a valid userName \n It must only contain alphabets and/underscore ("-")'),
      description: joi.string().min(2).max(500)
        .label('Please enter a valid description \n the field must not be empty and it must be more than 10 letters'),
      message: joi.string().min(10).max(500)
        .label('Please enter a valid message \n the field must not be empty and it must be more than 10 letters'),
      mediaUrls: joi.array().items(joi.string().uri())
        .label('Please upload urls of media images in the right format'),
      subCategories: joi.array().items(joi.string())
        .label('Please subcategories should be an array'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate required email
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateEmail(payload) {
    const schema = {
      email: joi.string().email().required()
        .label('Please enter a valid email address'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate required vendorId
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateVendorId(payload) {
    const schema = {
      vendorId: joi.string().required()
        .label('Please enter a valid vendor id'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate required id
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateId(payload) {
    const schema = {
      id: joi.number().positive().required()
        .label('Please enter a positive number for id parameter'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate feedback
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateFeedback(payload) {
    const schema = {
      feedback: joi.string().min(10).max(500).regex(/^[\w',-\\/.\s]*$/)
        .required()
        .label('Please enter a valid feedback. more than 10 characters and less than 500'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

    /**
   * validate images
   * @param {object} payload - user object
   * @returns {object | boolean} - returns a boolean or an error object
   * @memberof GeneralValidation
   */
  validateImages(payload) {
    const schema = {
      file: joi.object({ files: joi.array().single() }).label('Please upload more than 1 image')
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

  /**
   * validate user profile data
   * @param {object} payload - user object
   * @returns {object | boolean} - returns an error object or valid boolean
   */
  validateProfile(payload) {
    const schema = {
      vendorId: joi.string().label('Please enter a valid vendor id'),
      name: joi.string().min(3).max(25)
        .label('Please enter a valid firstname \n the field must not be empty and it must be more than 2 letters'),
      gender: joi.string().valid('male', 'female')
        .label('please input a gender (male or female)'),
      birthDate: joi.date().iso().label('Please input a valid date format: yy-mm-dd'),
      // eslint-disable-next-line no-useless-escape
      phoneNumber1: joi.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/).label('Please input a valid phone number'),
      phoneNumber2: joi.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/).label('Please input a valid phone number'),
      email: joi.string().email().label('Please enter a valid email address'),
      companyName: joi.string().min(3).max(50)
        .label('company name has a limit of 50 characters'),
      approvalStatus: joi.string().valid('pending', 'approved', 'rejected').label('parameter must be approved/rejected'),
      discount: joi.number().label('Please add the product discount'),
      companyAddress: joi.string().min(3).max(120)
        .label('company address has a limit of 120 characters'),
      companyDescription: joi.string().min(3).max(500)
        .label('company description has a limit of 300 characters'),
      profileImage: joi.string().uri().label('Please profileImage must be in form of an image URL'),
      companyLogo: joi.string().uri().label('Please logo  must be in form of an image URL'),
      portfolioUrl: joi.string().uri().label('Please logo  must be in form of a URL'),
      website: joi.string().uri().label('Please logo  must be in form of a URL'),
      companyBanner: joi.string().uri().label('Please company banner must be in form of an image URL'),
      companyUrl: joi.string().uri().label('Please company website must be in form of a URL'),
      companyEmail: joi.string().email()
        .label('Please enter a valid email address'),
      companyTheme: joi.string().regex(/^#[A-Fa-f0-9]{6}$/).label('colour nust be a Hex in format #ffffff'),
      mediaPictures: joi.array().items(joi.string().uri())
        .label('Please upload urls of media images in the right format'),
      companyLocation: joi.array().items(joi.string())
      .label('Please companyLocation should be an array'),
      file: joi.array()
      .label('Please images should be an array'),
      // eslint-disable-next-line no-useless-escape
      companyPhoneNumber: joi.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/).label('Please input a valid phone number'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

};

export default GeneralValidation;
