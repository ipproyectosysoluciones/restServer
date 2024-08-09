import { request, response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

/**
 * @name validateJWT
 * @description Valida el token JWT en la cabecera de la petición.

 * @param {*} res 
 * @param {*} req
 * @returns { void } Devuelve el controlador para la siguiente petición.
 */
const validateJWT = async( req = request, res = response, next ) => {

  const token = req.header( 'x-token' );

  if ( !token ) {
    return res.status( 401 ).json({ 
      msg: 'No hay token en la peticion - x-token' 
    });
  };

  try {
    const { uid } = jwt.verify( token, process.env.SECRET_JWT_SEED );

    const user = await User.findById( uid );

    if ( !user || !user.state ) {
      return res.status( 401 ).json({ 
        msg: 'Token no válido - estado: false o  user: eliminado de la DB',
      });
    };

    req.user = user;
    
    next();
  } catch ( error ) {
    console.log( error );
    return res.status( 401 ).json({ 
      msg: 'Token no válido' 
    });
  };
};

export {
  validateJWT,
};