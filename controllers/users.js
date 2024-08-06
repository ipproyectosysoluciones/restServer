import { response, request } from 'express';
import bcryptjs from 'bcryptjs';
import User from '../models/user.js';


/**
 * @name usersGet
 * @description 
 * @param {*} req 
 * @param {*} res 
 */
const usersGet = ( req = request, res = response ) => {
  const { q, name = 'No name', apikey, page = 1, limit } = req.query;

  res.json({
    msg: 'get API - controller',
    q,
    name,
    apikey,
    page,
    limit,
  });
};

/**
 * @name usersPost
 * @description Controlador para manejar las solicitudes POST y crear un nuevo usuario en la base de datos.
 * @param {*} req Objeto de solicitud que contiene la información enviada por el cliente.
 * @param {*} res Objeto de respuesta que se utiliza para enviar la respuesta de vuelta al cliente.
 * @returns { Promise<void> } Devuelve una promesa que se resuelve cuando la solicitud se completa.
 */
const usersPost = async( req = request, res = response ) => {

  // Validate the data
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Check if the email exists
  const existEmail = await User.findOne({ email });

  if ( existEmail ) {
    return res.status( 400 ).json({ 
      msg: 'El email ya está registrado', 
    });
  };

  // Hash the password
  const salt = bcryptjs.genSaltSync( 10 );
  user.password = bcryptjs.hashSync( password, salt );

  // Save the user to the database
  await user.save();

  res.json({
    user,
  });
};

/**
 * @name usersPut
 * @description
 * @param {*} req 
 * @param {*} res 
 */
const usersPut = ( req, res = response ) => {
  const { id } = req.params;

  res.json({
    msg: 'put API - controller',
    id,
  });
};

/**
 * @name
 * @description
 * @param {*} req 
 * @param {*} res 
 */
const usersPatch = ( req, res = response ) => {
  res.json({
    msg: 'patch API - controller',
  });
};

/**
 * @name usersDelete
 * @description
 * @param {*} req 
 * @param {*} res 
 */
const usersDelete = ( req, res = response ) => {
  res.json({
    msg: 'delete API - controller',
  });
}

export { 
  usersDelete,
  usersGet,
  usersPatch,
  usersPost,
  usersPut,
};