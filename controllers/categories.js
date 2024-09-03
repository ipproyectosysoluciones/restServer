import { request, response } from 'express';
import { Category } from '../models/index.js';


const createCategory = async( req = request, res = response ) => {

  const name = req.body.name.toUpperCase();
  const categoryDB = await Category.findOne({ name });

  if ( categoryDB ) {
    return res.status( 400 ).json({ 
      msg: `La categoría ${ categoryDB.name }, ya existe` 
    });
  };

  // Generate the Data to Save
  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category( data );

  // Save Category
  await category.save();

  res.status( 201 ).json( category );
};

export {
  createCategory,
};