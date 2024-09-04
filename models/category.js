import { Schema, model } from 'mongoose';

/**
 * @name CategorySchema
 * @description Esquema de categoría para MongoDB utilizando Mongoose.
 * Define la estructura y validaciones para los documentos de categorías.
 */
const CategorySchema = Schema({
  name: {
    type: String,
    required: [ true, 'El nombre es obligatorio' ],
    unique: true,
  },
  state: {
    type: Boolean,
    default: true,
    required: [ true, 'El estado es obligatorio' ],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [ true, 'El usuario es obligatorio' ],
  },
});

CategorySchema.methods.toJSON = function () {
  const { __v, state, ...data } = this.toObject();
  return data;
};

export default model( 'Category', CategorySchema );