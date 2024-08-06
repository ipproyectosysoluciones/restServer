import Role from '../models/role.js';
import User from '../models/user.js';

/**
 * @name isRoleValid
 * @description Valida si un rol es válido según la base de datos.
 * @param { string } role - Rol a validar.
 * @returns { Promise<boolean> } Devuelve true si el rol es válido y false si no lo es.
 */
const isRoleValid = async( role = '' ) => {
  const existRole = await Role.findOne({ role });

  if ( !existRole ) {
    throw new Error( `El rol ${ role } no está registrado en la DB!!` );
  };
};

/**
 * @name existEmail
 * @description Valida si un email existe en la base de datos.
 * @param { string } email - Email a validar.
 * @returns { Promise<void> } Devuelve una promesa que se resuelve cuando el email existe en la base de datos.
 */
const existEmail = async( email = '' ) => {
  // Check if the email exists
  const existEmail = await User.findOne({ email });

  if ( existEmail ) {
    throw new Error( `El email: ${ email }, ya se encuentra registrado en la DB!!` );
  };
};

export { 
  existEmail,
  isRoleValid, 
};