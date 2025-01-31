import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middleware/index.js';
import { collectionsAllowed } from '../helpers/index.js';
import { uploadFile, updateImage } from '../controllers/index.js';

const router = Router();

router.post('/', uploadFile);

router.put(
  '/:collection/:id',
  [
    check('id', 'El ID debe ser de MongoDB').isMongoId(),
    check('collection').custom((c) =>
      collectionsAllowed(c, ['users', 'products']),
    ),
    validateFields,
  ],
  updateImage,
);

export default router;
