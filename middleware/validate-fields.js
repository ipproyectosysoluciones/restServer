import { validationResult } from 'express-validator';


/**
 * @name validateFields
 * @description Valida los campos de la solicitud y devuelve un error 400 si hay algún error.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * @returns 
 */
const validateFields = ( req, res, next ) => {
  // Validate the request data
  const errors = validationResult( req );

  if ( !errors.isEmpty() ) {
    return res.status( 400 ).json({ 
      msg: errors.array(), 
    });
  };

  next();
};

export {
  validateFields,
};