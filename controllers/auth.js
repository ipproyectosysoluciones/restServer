import { request, response } from 'express';
import bcryptjs from 'bcryptjs';
import User from '../models/user.js';
import { generateJWT } from '../helpers/generate-jwt.js';


/**
 * @name login
 * @description Controlador para manejar las solicitudes POST y iniciar sesión de un usuario en la base de datos.
 * @param {*} req Objeto de solicitud que contiene la información enviada por el cliente.
 * @param {*} res Objeto de respuesta que se utiliza para enviar la respuesta de vuelta al cliente.
 * @returns { Promise<void> } Devuelve una promesa que se resuelve cuando la solicitud se completa.
 */
const login = async( req = request, res = response ) => {

  const { email, password } = req.body;

  try {
    // Check if the email exists.
    const user = await User.findOne({ email });

    if ( !user ) {
      return res.status( 400 ).json({ 
        msg: 'Usuario / Password no son correctos - email' 
      });
    };

    // Check if the user is active.
    if ( !user.state ) {
      return res.status( 400 ).json({
        msg: 'Usuario / Password no son correctos - state: false'
      });
    };

    // Check if the password is correct.
    const validPassword = bcryptjs.compareSync( password, user.password );

    if ( !validPassword ) {
      return res.status( 400 ).json({ 
        msg: 'Usuario / Password no son correctos - password' 
      });
    };

    // Generating an authentication token - JWT.
    const token = await generateJWT( user.id );

    res.json({
      user,
      token,
    });
  } catch ( error ) {
    console.log( error );
    return res.status( 500 ).json({
      msg: 'Hable con el Adminsitrador',
    });
  };

};

export {
  login,
};