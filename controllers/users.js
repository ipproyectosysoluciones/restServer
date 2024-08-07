import { response, request } from 'express';
import bcryptjs from 'bcryptjs';
import User from '../models/user.js';


/**
 * @name usersGet
 * @description Controlador para manejar las solicitudes GET y obtener todos los usuarios en la base de datos.
 * @param {*} req Objeto de solicitud que contiene la información enviada por el cliente.
 * @param {*} res Objeto de respuesta que se utiliza para enviar la respuesta de vuelta al cliente.
 */
const usersGet = async( req = request, res = response ) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { state: true };

  // Find all the users and paginate them
  const [ total, users ] = await Promise.all([
    User.countDocuments( query ),
    User.find( query ).skip( Number( from )).limit( Number( limit )),
  ]);

  res.json({
    total,
    users,
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
 * @description Controlador para manejar las solicitudes PUT y actualizar un usuario en la base de datos.
 * @param {*} req Objeto de solicitud que contiene la información enviada por el cliente.
 * @param {*} res Objeto de respuesta que se utiliza para enviar la respuesta de vuelta al cliente.
 * @returns { Promise<void> } Devuelve una promesa que se resuelve cuando la solicitud se completa.
 */
const usersPut = async( req = request, res = response ) => {
  const { id } = req.params;
  const { _id, password, google, email, ...rest } = req.body;

  // TODO: Válidar contra DB
  if ( password ) {
    // Hash the password
  const salt = bcryptjs.genSaltSync( 10 );
  rest.password = bcryptjs.hashSync( password, salt );
  };

  const user = await User.findByIdAndUpdate( id, rest );

  res.json( user );
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
 * @description Controlador para manejar las solicitudes DELETE y eliminar un usuario de la base de datos.
 * @param {*} req Objeto de solicitud que contiene la información enviada por el cliente.
 * @param {*} res Objeto de respuesta que se utiliza para enviar la respuesta de vuelta al cliente.
 * @returns { Promise<void> } Devuelve una promesa que se resuelve cuando la solicitud se completa.
 */
const usersDelete = async( req = request, res = response ) => {
  const { id } = req.params;
  
  const user = await User.findByIdAndUpdate( id, { state: false } );
  res.json( user );
}

export { 
  usersDelete,
  usersGet,
  usersPatch,
  usersPost,
  usersPut,
};