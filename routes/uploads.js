import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middleware/index.js';
import { uploadFile } from '../controllers/uploads.js';

const router = Router();

router.post('/', uploadFile);

export default router;
