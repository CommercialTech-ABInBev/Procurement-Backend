import { Router } from 'express';
import {
  Bouncers,
} from '../middleware';
// import { ProductController, UserController, OrderController } from '../controllers';

const router = Router();
const {
  supplierBouncers,
} = Bouncers;
// const {
//   addOrUpdateSupplierAccount,
//   getSupplierAccount,
//   searchSupplier
// } = UserController;

router.post('/profile', supplierBouncers);

export default router;
