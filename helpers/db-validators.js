import Role from '../models/role.js';

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

export { isRoleValid };