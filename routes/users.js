import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middleware/validate-fields.js';
import { existEmail, userIdExist, isRoleValid } from '../helpers/db-validators.js';
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

/**
 * @route POST /api/users
 * @description Crear un nuevo usuario
 * @access Public
 * @param { string } name - Nombre del usuario.
 * @param { string } email - Email del usuario.
 * @param { string } password - Password del usuario. 
 * @param { string } role - Rol del usuario. Debe ser 'ADMIN_ROLE' o 'USER_ROLE' o 'SALES_ROLE'.
 * @returns { Object } - Usuario creado.
 */
router.post( '/', [
  check( 'name', 'El nombre es obligatorio' ).not().isEmpty(),
  check( 'password', 'El password debe de tener más de 6 carácteres' ).isLength({ min: 6 }),
  check( 'email', 'El email no es válido' ).isEmail(),
  check( 'email' ).custom( existEmail ),
  // check( 'role', 'No es un rol válido' ).isIn([ 'ADMIN_ROLE', 'USER_ROLE' ]),
  check( 'role' ).custom( isRoleValid ),
  validateFields,
], usersPost );

/**
 * @route PUT /api/users/:id
 * @description Actualizar un usuario
 * @access Privado
 * @param { string } id - ID del usuario a actualizar.
 * @param { string } name - Nuevo nombre del usuario.
 * @param { string } email - Nuevo email del usuario.
 * @param { string } password - Nuevo password del usuario.
 * @param { string } role - Nuevo rol del usuario. Debe ser 'ADMIN_ROLE' o 'USER_ROLE' o 'SALES_ROLE'.
 * @returns { Object } - Usuario actualizado.
 */
router.put( '/:id', [
  check( 'id', 'No es un ID válido' ).isMongoId(),
  check( 'id' ).custom( userIdExist ),
  check( 'role' ).custom( isRoleValid ),
  validateFields,
], usersPut );

router.patch( '/', usersPatch );

router.delete( '/', usersDelete );

export default router;