import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields, validateJWT } from '../middleware/index.js';
import { createCategory } from '../controllers/categories.js';

const router = Router();

router.get( '/', ( req, res ) => {
  res.json({ msg: 'Get' });
});

router.get( '/:id', ( req, res ) => {
  res.json({ msg: 'Get by ID' });
});

router.post( '/', [ 
  validateJWT, 
  check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
  validateFields,
], createCategory );

router.put( '/:id', ( req, res ) => {
  res.json({ msg: 'Put' });
});

router.delete( '/:id', ( req, res ) => {
  res.json({ msg: 'Delete' });
});

export default router;