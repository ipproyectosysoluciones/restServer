import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { response, request } from 'express';
import { uploadFile } from '../helpers/index.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { User, Product } from '../models/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createResponse = (status = 'success', data = null, message = null) => ({
  status,
  ...(data && { data }),
  ...(message && { message }),
  timestamp: new Date().toISOString()
});

/**
 * @name getModelByCollection
 * @description Obtiene y valida modelo según colección
 */
const getModelByCollection = async (collection, id) => {
  const models = {
    users: User,
    products: Product
  };

  const Model = models[collection];
  if (!Model) {
    throw new Error(`Colección ${collection} no válida`);
  }

  const document = await Model.findById(id);
  if (!document) {
    throw new Error(`No existe un ${collection} con el id ${id}`);
  }

  return document;
};

/**
 * @name uploadFileController
 * @description Controlador para subida de archivos
 */
const uploadFileController = async (req = request, res = response) => {
  try {
    const fileName = await uploadFile(req.files, undefined, 'uploads');
    return res.json(createResponse('success', { fileName }));
  } catch (error) {
    console.error('Error en uploadFileController:', error);
    return res.status(400).json(
      createResponse('error', null, error.message)
    );
  }
};

/**
 * @name updateImageCloudinary
 * @description Actualizar imagen en Cloudinary
 */
const updateImageCloudinary = async (req = request, res = response) => {
  try {
    const { collection, id } = req.params;
    
    if (!req.files?.file) {
      throw new Error('No se ha proporcionado ningún archivo');
    }

    const model = await getModelByCollection(collection, id);
    
    // Gestionar imagen previa
    if (model.img) {
      const publicId = model.img.split('/').pop().split('.')[0];
      await deleteFromCloudinary(publicId).catch(console.error);
    }

    // Subir nueva imagen
    const { tempFilePath } = req.files.file;
    const { secure_url } = await uploadToCloudinary(tempFilePath, {
      folder: `coffee-shop/${collection}`
    });

    model.img = secure_url;
    await model.save();

    // Limpiar archivo temporal
    await fs.unlink(tempFilePath).catch(console.error);

    return res.json(createResponse('success', { model }));

  } catch (error) {
    console.error('Error en updateImageCloudinary:', error);
    return res.status(error.status || 500).json(
      createResponse('error', null, error.message || 'Error interno del servidor')
    );
  }
};

/**
 * @name showImage
 * @description Mostrar imagen de entidad
 */
const showImage = async (req = request, res = response) => {
  try {
    const { collection, id } = req.params;
    const model = await getModelByCollection(collection, id);

    if (model.img) {
      const imagePath = path.join(__dirname, '../uploads', collection, model.img);
      if (await fs.access(imagePath).then(() => true).catch(() => false)) {
        return res.sendFile(imagePath);
      }
    }

    // Imagen por defecto si no se encuentra
    const defaultImage = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(defaultImage);

  } catch (error) {
    console.error('Error en showImage:', error);
    return res.status(404).json(
      createResponse('error', null, error.message)
    );
  }
};

export { 
  showImage, 
  uploadFileController as uploadFile,
  updateImageCloudinary 
};
