import { Router } from 'express';
import { check } from 'express-validator';
import {
  isAdminRole,
  validateFields,
  validateJWT,
} from '../middleware/index.js';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../controllers/categories.js';
import { categoryIdExit } from '../helpers/db-validators.js';

const router = Router();

router.get('/', getCategories);

router.get(
  '/:id',
  [
    check('id', 'No es un ID de Mongo').isMongoId(),
    check('id').custom(categoryIdExit),
    validateFields,
  ],
  getCategory,
);

router.post(
  '/',
  [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields,
  ],
  createCategory,
);

router.put(
  '/:id',
  [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(categoryIdExit),
    check('id', 'No es un ID de Mongo').isMongoId(),
    validateFields,
  ],
  updateCategory,
);

router.delete(
  '/:id',
  [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID de Mongo').isMongoId(),
    check('id').custom(categoryIdExit),
    validateFields,
  ],
  deleteCategory,
);

export default router;
