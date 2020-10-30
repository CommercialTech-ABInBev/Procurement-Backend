import { Router } from 'express';
import { Bouncers } from '../middleware';
import { CategoryController } from '../controller';

const router = Router();
const {
  userBouncers
} = Bouncers;
const {
    getCategories
} = CategoryController;

router.get('/', userBouncers, getCategories);

export default router;
