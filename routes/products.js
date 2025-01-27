import { Router } from 'express';
import { check } from 'express-validator';
import {
  isAdminRole,
  validateFields,
  validateJWT,
} from '../middleware/index.js';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/products.js';
import { categoryIdExit, productIdExit } from '../helpers/db-validators.js';

const router = Router();

router.get('/', getProducts);

router.get(
  '/:id',
  [
    check('id', 'No es un ID de Mongo').isMongoId(),
    check('id').custom(productIdExit),
    validateFields,
  ],
  getProduct,
);

router.post(
  '/',
  [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un ID de Mongo').isMongoId(),
    check('category', 'La categoría es obligatoria y debe existir').custom(
      categoryIdExit,
    ),
    validateFields,
  ],
  createProduct,
);

router.put(
  '/:id',
  [
    validateJWT,
    // check('category', 'No es un ID de Mongo').isMongoId(),
    check('id').custom(productIdExit),
    validateFields,
  ],
  updateProduct,
);

router.delete(
  '/:id',
  [
    validateJWT,
    isAdminRole,
    check('id', 'No es un ID de Mongo').isMongoId(),
    check('id').custom(productIdExit),
    validateFields,
  ],
  deleteProduct,
);

export default router;
