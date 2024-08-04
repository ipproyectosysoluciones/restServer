import { response, request } from 'express';


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
 * @description
 * @param {*} req 
 * @param {*} res 
 */
const usersPost = ( req = request, res = response ) => {
  const { name, age } = req.body;

  res.json({
    msg: 'post API - controller',
    name,
    age,
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