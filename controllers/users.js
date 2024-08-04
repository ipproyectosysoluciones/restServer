import { response } from 'express';


/**
 * @name usersGet
 * @description 
 * @param {*} req 
 * @param {*} res 
 */
const usersGet = ( req, res = response ) => {
  res.json({
    msg: 'get API - controller',
  });
};

/**
 * @name usersPost
 * @description
 * @param {*} req 
 * @param {*} res 
 */
const usersPost = ( req, res = response ) => {
  const { name, age } = req.body;

  res.status( 201 ).json({
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
  res.status( 500 ).json({
    msg: 'put API - controller',
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