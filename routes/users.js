import { Router } from 'express';
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

router.post( '/', usersPost );

router.put( '/', usersPut );

router.patch( '/', usersPatch );

router.delete( '/', usersDelete );

export default router;