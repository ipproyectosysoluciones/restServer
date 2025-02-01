import { response, request } from 'express';
import bcryptjs from 'bcryptjs';
import { User } from '../models/index.js';

/**
 * @typedef {Object} PaginatedResponse
 * @property {number} total - Total de registros
 * @property {number} page - Página actual
 * @property {number} limit - Límite por página
 * @property {Array<Object>} data - Datos paginados
 */

const createResponse = (status = 'success', data = null, message = null) => ({
  status,
  ...(data && { data }),
  ...(message && { message }),
  timestamp: new Date().toISOString()
});

/**
 * @name usersGet
 * @description Obtener usuarios con paginación
 * @returns {Promise<PaginatedResponse>}
 */
const usersGet = async (req = request, res = response) => {
  try {
    const { 
      limit = 5, 
      from = 0,
      sort = 'name'
    } = req.query;

    const query = { state: true };

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query)
        .sort(sort)
        .skip(Number(from))
        .limit(Number(limit))
    ]);

    return res.json(createResponse('success', {
      total,
      page: Math.floor(from / limit) + 1,
      limit: Number(limit),
      users
    }));
  } catch (error) {
    console.error('Error en usersGet:', error);
    return res.status(500).json(
      createResponse('error', null, 'Error al obtener usuarios')
    );
  }
};

/**
 * @name usersPost
 * @description Crear nuevo usuario
 */
const usersPost = async (req = request, res = response) => {
  try {
    const { name, email, password, role } = req.body;

    const user = new User({ 
      name, 
      email: email.toLowerCase(), 
      password, 
      role 
    });

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync(10);
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    return res.status(201).json(createResponse('success', { user }));
  } catch (error) {
    console.error('Error en usersPost:', error);
    return res.status(500).json(
      createResponse('error', null, 'Error al crear usuario')
    );
  }
};

/**
 * @name usersPut
 * @description Actualizar usuario existente
 */
const usersPut = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { _id, password, google, email, ...rest } = req.body;

    if (password) {
      const salt = bcryptjs.genSaltSync(10);
      rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(
      id, 
      rest, 
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json(
        createResponse('error', null, 'Usuario no encontrado')
      );
    }

    return res.json(createResponse('success', { user }));
  } catch (error) {
    console.error('Error en usersPut:', error);
    return res.status(500).json(
      createResponse('error', null, 'Error al actualizar usuario')
    );
  }
};

/**
 * @name usersPatch
 * @description Actualización parcial de usuario
 */
const usersPatch = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json(
        createResponse('error', null, 'Usuario no encontrado')
      );
    }

    return res.json(createResponse('success', { user }));
  } catch (error) {
    console.error('Error en usersPatch:', error);
    return res.status(500).json(
      createResponse('error', null, 'Error al actualizar usuario')
    );
  }
};

/**
 * @name usersDelete
 * @description Desactivar usuario (borrado lógico)
 */
const usersDelete = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json(
        createResponse('error', null, 'Usuario no encontrado')
      );
    }

    return res.json(createResponse('success', { user }));
  } catch (error) {
    console.error('Error en usersDelete:', error);
    return res.status(500).json(
      createResponse('error', null, 'Error al eliminar usuario')
    );
  }
};

export { usersDelete, usersGet, usersPatch, usersPost, usersPut };
