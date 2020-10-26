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
      id: joi.number().positive()
        .label('id parameter must be a positive number'),
      userId: joi.number().positive()
        .label('id parameter must be a positive number'),
      name: joi.string().min(3).max(30)
        .label('Please enter a valid name \n the field must not be empty and it must be more than 2 letters'),
      userName: joi.string().regex(/^[a-zA-Z0-9_]{3,30}$/)
        .label('Please input a valid userName \n It must only contain alphabets and/underscore ("-")'),
      description: joi.string().min(10).max(500)
        .label('Please enter a valid description \n the field must not be empty and it must be more than 10 letters'),
      price: joi.number().label('Please add the product price as a mumber'),
      stockQuantity: joi.number().label('Please add the product stock quantity as a mumber'),
      unit: joi.string().min(3).max(25)
        .label('Please enter a valid product unit (pack, drum) \n the field must not be empty and it must be more than 2 letters.'),
      imageUrl: joi.string().uri().label('Please upload a featured image'),
      mediaUrls: joi.array().items(joi.string().uri())
        .label('Please upload urls of media images in the right format'),
      sizes: joi.array().items(joi.string())
        .label('Please upload fixed product sizes (XXL, 50litres, etc) in the right string format'),
      tags: joi.array().items(joi.string())
        .label('Please upload product tags in the right string format'),
      available: joi.bool().label('parameter must be a boolean - True or false'),
      approved: joi.bool().label('parameter must be a boolean - True or false'),
      discount: joi.number().label('Please add the product discount'),
      minPrice: joi.number().label('Please add the product price as a number'),
      maxPrice: joi.number().label('Please add the product price as a number'),
      offset: joi.number().label('Please offset should be a number'),
      limit: joi.number().label('Please limit should be a number'),
      quantity: joi.number().positive()
        .label('quantity parameter must be a positive number'),
      addressLine1: joi.string().min(3).max(60).regex(/^[\w',-\\/.\s]*$/)
        .label('Please enter a valid address that is within 3 to 60 characters long'),
      addressLine2: joi.string().min(3).max(60).regex(/^[\w',-\\/.\s]*$/)
        .label('Please enter a valid address that is within 3 to 60 characters long'),
      city: joi.string().min(3).max(25).label('Please input a city name'),
      accountNumber: joi.string().regex(/^[0-9]{10}$/).label('Please input a valid account number, it must be 10 digits'),
      zip: joi.string().min(3).max(7).label('Please input a valid zip code, it must be 5 digits'),
      contactNumber: joi.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/).label('Please input a valid phone number'),
      reference: joi.string().min(3).max(30).label('Please enter a valid reference string'),
      note: joi.string().min(5).max(200).label('Please enter a valid reference string'),
      status: joi.string().valid('pending', 'completed', 'cancelled', 'processing', 'delivered', 'in transit', 'pickup')
        .label('please input a status, for route admin/order: (completed, pending, or cancelled), for route supplier/order: (processing, in transit, pickup, delivered)'),
      merchantPercentage: joi.string().regex(/^\d+(?:\.\d{1,2})?$/).label('Please percentage value should be atmost 2 decimal points'),
      comments: joi.string().min(10).max(500)
        .label('Please enter a valid comment. more than 10 characters and less than 500'),
      ratings: joi.number().max(5).label('Please ratings should be a number and not more than 5'),
      iconUrl: joi.string().uri().label('Please IconUrl should be a Url String'),
      live: joi.bool().label('parameter must be a boolean - True or false'),
      themeColour: joi.string().regex(/^#[A-Fa-f0-9]{6}$/).label('colour nust be a Hex in format #ffffff'),
      companyTheme: joi.string().regex(/^#[A-Fa-f0-9]{6}$/).label('colour nust be a Hex in format #ffffff'),
      type: joi.string().valid('inappropriate', 'illegal', 'harmful', 'deceitful')
        .label('Type value is Invalid, try inappropriate/illegal/harmful/deceitful'),
      comment: joi.string().min(10).max(280)
        .label('Please enter a valid comment \n the field must not be empty and it must be more than 10 letters'),
      resolved: joi.bool().label('parameter must be a boolean - True or false'),
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
   * validate user profile data
   * @param {object} payload - user object
   * @returns {object | boolean} - returns an error object or valid boolean
   */
  validateProfile(payload) {
    const schema = {
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
      companyAddress: joi.string().min(3).max(120)
        .label('company address has a limit of 120 characters'),
      companyDescription: joi.string().min(3).max(300)
        .label('company description has a limit of 300 characters'),
      profileImage: joi.string().uri().label('Please profileImage must be in form of an image URL'),
      companyLogo: joi.string().uri().label('Please logo  must be in form of an image URL'),
      portfolioUrl: joi.string().uri().label('Please logo  must be in form of an image URL'),
      companyBanner: joi.string().uri().label('Please company banner must be in form of an image URL'),
      companyUrl: joi.string().uri().label('Please company website must be in form of a URL'),
      companyEmail: joi.string().email()
        .label('Please enter a valid email address'),
      companyTheme: joi.string().regex(/^#[A-Fa-f0-9]{6}$/).label('colour nust be a Hex in format #ffffff'),
      // eslint-disable-next-line no-useless-escape
      companyPhoneNumber: joi.string().regex(/^[0-9+\(\)#\.\s\/ext-]+$/).label('Please input a valid phone number'),
    };
    const { error } = joi.validate({ ...payload }, schema);
    if (error) throw error.details[0].context.label;
    return true;
  },

};

export default GeneralValidation;
