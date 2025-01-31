import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields, validateFileUpload } from '../middleware/index.js';
import { collectionsAllowed } from '../helpers/index.js';
import { showImage, uploadFile, updateImage, updateImageCloudinary } from '../controllers/index.js';

const router = Router();

router.get(
  '/:collection/:id',
  [
    check('id', 'El ID debe ser de MongoDB').isMongoId(),
    check('collection').custom((c) =>
      collectionsAllowed(c, ['users', 'products']),
    ),
    validateFields,
  ],
  showImage,
);

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
  updateImageCloudinary,
  // updateImage,
);

export default router;
