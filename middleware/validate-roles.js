import { request, response } from 'express';

/**
 * @name isAdminRole
 * @description Valida si el usuario tiene el role ADMIN_ROLE.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const isAdminRole = (req = request, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: 'Se requiere verificar el role sin validar el token primero',
    });
  }

  const { role, name } = req.user;

  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `${name}, no tienes permisos para realizar esta acción`,
    });
  }

  next();
};

/**
 * @name hasRole
 * @description Valida si el usuario tiene alguno de los roles especificados.
 * @param { ...string } roles - Roles a validar.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: 'Se requiere verificar el role sin validar el token primero',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles ${roles}`,
      });
    }

    next();
  };
};
