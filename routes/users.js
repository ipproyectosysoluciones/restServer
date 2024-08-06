import { Router } from 'express';
import { check } from 'express-validator';
import { 
  usersDelete,
  usersGet,
  usersPatch,
  usersPost,
  usersPut,
 } from '../controllers/users.js';

const router = Router();

// Define the routes
router.get( '/', usersGet );

router.post( '/', [
  check( 'email', 'El email no es válido' ).isEmail(),
], usersPost );

router.put( '/:id', usersPut );

router.patch( '/', usersPatch );

router.delete( '/', usersDelete );

export default router;