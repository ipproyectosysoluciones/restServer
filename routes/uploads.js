import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middleware/index.js';
import { uploadFile } from '../controllers/index.js';

const router = Router();

router.post('/', uploadFile);

export default router;
