import multer from 'multer';
import { Toolbox } from '../util';
import path from "path";

const {
  errorResponse,
} = Toolbox;

// const storage = multer.diskStorage({
//   // destination: (req, file, cb) => {
//   //     cb(null, 'uploads');
//   // },
//   filename: (req, file, cb) => {
//       // console.log(file);
//       cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/JPEG') {
//       cb(null, true);
//   } else {
//       cb(null, false);
//   }
// }
// const upload = multer({ storage: storage, fileFilter: fileFilter });

const upload = multer({
	limits: {
		fileSize: 100000000
	},

	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|svg|PNG)$/)) {
			return errorResponse(404, 'File is not a valid');
		}

		cb(undefined, true);
	}
});
export default upload;
