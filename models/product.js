import { Schema, model } from 'mongoose';

/**
 * @name ProductSchema
 * @description Esquema de producto para MongoDB utilizando Mongoose.
 * Define la estructura y validaciones para los documentos de productos.
 */
const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
  },
  state: {
    type: Boolean,
    default: true,
    required: [true, 'El estado es obligatorio'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio'],
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es obligatoria'],
  },
  description: { type: String },
  available: { type: Boolean, default: true },
});

ProductSchema.methods.toJSON = function () {
  const { __v, state, ...data } = this.toObject();
  return data;
};

export default model('Product', ProductSchema);
