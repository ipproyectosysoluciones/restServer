import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields, validateFileUpload } from '../middleware/index.js';
import { collectionsAllowed } from '../helpers/index.js';
import { uploadFile, updateImage } from '../controllers/index.js';

const router = Router();

router.post('/', validateFileUpload, uploadFile);

router.put(
  '/:collection/:id',
  [
    validateFileUpload,
    check('id', 'El ID debe ser de MongoDB').isMongoId(),
    check('collection').custom((c) =>
      collectionsAllowed(c, ['users', 'products']),
    ),
    validateFields,
  ],
  updateImage,
);

export default router;
