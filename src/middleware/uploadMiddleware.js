import multer from 'multer';

const UploadMiddleware = {
  /**
   * check if upload data is not more than 10mb
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} - returns error or response object
   * @memberof UploadMiddleware
   */
  verifyUpload(req, res, next) {
    try {
      multer({
        limits: {
          fileSize: 1000000
        },
      
        fileFilter(req, file, cb) {
          if (!file.originalname.match(/\.(jpg|jpeg|png|svg|PNG)$/)) {
            return cb(new ErrorEvent('PLease upload a Picture format'));
          }
      
          cb(undefined, true);
        }
      });
      next();
    } catch (error) {
      errorResponse(res, {});
    }
  }
};

export default UploadMiddleware;
