import { Schema, model } from 'mongoose';

/**
 * @name RoleShema
 * @description Esquema de rol para MongoDB utilizando Mongoose.
 * Define la estructura y validaciones para los documentos de roles.
 */
const RoleSchema = Schema({
  role: {
    type: String,
    required: [true, 'El rol es obligatorio'],
  },
});

export default model('Role', RoleSchema);
