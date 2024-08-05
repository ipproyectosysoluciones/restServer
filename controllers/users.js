import { response, request } from 'express';
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
 * @param {*} req Objeto de solicitud que contiene la información del cliente, como los datos enviados en el cuerpo de la solicitud (req.body).
 * @param {*} res Objeto de respuesta que se utiliza para enviar la respuesta de vuelta al cliente.
 * @returns { Promise<void> } Devuelve una promesa que se resuelve cuando la solicitud se completa.
 */
const usersPost = async( req = request, res = response ) => {
  const body = req.body;
  const user = new User( body );

  await user.save();

  res.json({
    msg: 'post API - controller',
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