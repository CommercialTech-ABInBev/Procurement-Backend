import multer from 'multer';
import { Toolbox } from '../util';

const {
  errorResponse,
} = Toolbox;

const upload = multer({
  limits: {
    fileSize: 100000000
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|svg|PNG|JFIF|jfif|SVG|JPEG)$/)) {
      return errorResponse(404, 'File is not a valid');
    }

    cb(undefined, true);
  }
});
export default upload;
