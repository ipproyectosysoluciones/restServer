import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middleware/index.js';

const router = Router();

router.get( '/', ( req, res ) => {
  res.json({ msg: 'Get' });
});

router.get( '/:id', ( req, res ) => {
  res.json({ msg: 'Get by ID' });
});

router.post( '/', ( req, res ) => {
  res.json({ msg: 'Post' });
});

router.put( '/:id', ( req, res ) => {
  res.json({ msg: 'Put' });
});

router.delete( '/:id', ( req, res ) => {
  res.json({ msg: 'Delete' });
});

export default router;