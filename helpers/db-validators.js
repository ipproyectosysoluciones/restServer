import { Role, User, Category, Product } from '../models/index.js';

/**
 * @name isRoleValid
 * @description Valida si un rol es válido según la base de datos.
 * @param { string } role - Rol a validar.
 * @returns { Promise<boolean> } Devuelve true si el rol es válido y false si no lo es.
 */
const isRoleValid = async (role = '') => {
  const existRole = await Role.findOne({ role });

  if (!existRole) {
    throw new Error(`El rol ${role} no está registrado en la DB!!`);
  }
};

/**
 * @name existEmail
 * @description Valida si un email existe en la base de datos.
 * @param { string } email - Email a validar.
 * @returns { Promise<void> } Devuelve una promesa que se resuelve cuando el email existe en la base de datos.
 */
const existEmail = async (email = '') => {
  // Check if the email exists
  const existEmail = await User.findOne({ email });

  if (existEmail) {
    throw new Error(
      `El email: ${email}, ya se encuentra registrado en la DB!!`,
    );
  }
};

/**
 * @name userIdExist
 * @description Valida si un ID de usuario existe en la base de datos.
 * @param { string } id - ID del usuario a validar.
 * @returns { Promise<void> } Devuelve una promesa que se resuelve cuando el ID de usuario existe en la base de datos.
 */
const userIdExist = async (id) => {
  // Check if the ID exists
  const userExist = await User.findById(id);

  if (!userExist) {
    throw new Error(`El id ${id}, no existe!!`);
  }
};

/**
 * @name categoryIdExit
 * @description Valida si un ID de categoría existe en la base de datos.
 * @param { string } id - ID de la categoría a validar.
 * @returns { Promise<void> } Devuelve una promesa que se resuelve cuando el ID de categoría existe en la base de datos.
 */
const categoryIdExit = async (id) => {
  // Check if the ID exists
  const categoryExist = await Category.findById(id);

  if (!categoryExist) {
    throw new Error(`La categoría con id ${id}, no existe!!`);
  }
};

/**
 * @name productIdExit
 * @description Valida si un ID de producto existe en la base de datos.
 * @param { string } id - ID del producto a validar.
 * @returns { Promise<void> } Devuelve una promesa que se resuelve cuando el ID de producto existe en la base de datos.
 */
const productIdExit = async (id) => {
  // Check if the ID exists
  const productExist = await Product.findById(id);

  if (!productExist) {
    throw new Error(`El producto con id ${id}, no existe!!`);
  }
};

export { categoryIdExit, existEmail, productIdExit, userIdExist, isRoleValid };
