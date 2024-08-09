import { Schema, model } from 'mongoose';

/**
 * @name UserShema
 * @description Esquema de usuario para MongoDB utilizando Mongoose.
 * Define la estructura y validaciones para los documentos de usuarios.
 */
const UserSchema = Schema({
  name: {
    type: String,
    required: [ true, 'El nombre es Obligatorio' ],
  },
  email: {
    type: String,
    required: [ true, 'El email es Obligatorio' ],
    unique: true,
  },
  password: {
    type: String,
    required: [ true, 'La contraseña es Obligatorio' ],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: [ true, 'El rol es Obligatorio' ],
    default: 'USER_ROLE',
    emun: [ 'ADMIN_ROLE', 'USER_ROLE', 'SALES_ROLE' ],
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

export default model( 'User', UserSchema );
