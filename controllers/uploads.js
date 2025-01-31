import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { cloudinary } from '../config/cloudinary.js';
import { response, request } from 'express';
import { upload_File } from '../helpers/index.js';
import { User, Product } from '../models/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @name uploadFile
 * @description Controlador para subir archivos al server.
 * @param { Object } req - El objeto de solicitud que contiene los archivos a subir.
 * @param { Object } res - El objeto de respuesta para enviar el resultado.
 * @returns { Object } Devuelve un objeto con el nombre del archivo subido.
 */
const uploadFile = async (req = request, res = response) => {
  try {
    // 'txt', 'md'
    // const name = await upload_File(req.files, ['txt', 'md'], 'texts');
    // 'img'
    const name = await upload_File(req.files, undefined, 'img');
    res.json({ name });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

/**
 * @name updateImage
 * @description Controlador para actualizar la imagen de un usuario o producto.
 * @param { Object } req - El objeto de solicitud que contiene los parámetros de la URL.
 * @param { Object } res - El objeto de respuesta para enviar el resultado.
 * @returns { Object } Devuelve un objeto con el usuario o producto actualizado.
 */
const updateImage = async (req = request, res = response) => {
  const { collection, id } = req.params;

  let model;
  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;
    default:
      return res.status(500).json({ msg: 'Se me olvido hacer esto.' });
  }

  // Limpiar imágenes previas
  if (model.img) {
    // Borrar la imagen del servidor
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage);
    }
  }

  const name = await upload_File(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json(model);
};

/**
 * @name updateImageCloudinary
 * @description Controlador para actualizar la imagen de un usuario o producto utilizando Cloudinary.
 * @param { Object } req - El objeto de solicitud que contiene los parámetros de la URL y los datos de la imagen.
 * @param { Object } res - El objeto de respuesta para enviar el resultado.
 * @returns { Object } Devuelve un objeto con el usuario o producto actualizado.
 */
const updateImageCloudinary = async (req = request, res = response) => {
  try {
    const { collection, id } = req.params;

    let model;
    switch (collection) {
      case 'users':
        model = await User.findById(id);
        if (!model) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${id}`,
          });
        }
        break;
      case 'products':
        model = await Product.findById(id);
        if (!model) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${id}`,
          });
        }
        break;
      default:
        return res.status(500).json({ msg: 'Se me olvido hacer esto.' });
    }

    // Limpiar imágenes previas
    if (model.img) {
      const nameArr = model.img.split('/');
      const name = nameArr[nameArr.length - 1];
      const [public_id] = name.split('.');
      await cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;
    
    try {
      // Upload to Cloudinary
      const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {
        folder: collection, // Especifica la carpeta
      });

      model.img = secure_url;
      await model.save();
      
      // Cleanup temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }

      res.json(model);
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      res.status(500).json({ 
        msg: 'Error al subir imagen a Cloudinary',
        error: uploadError.message 
      });
    }
  } catch (error) {
    console.error('General error:', error);
    res.status(500).json({ 
      msg: 'Error en el servidor',
      error: error.message 
    });
  }
};

/**
 * @name showImage
 * @description Controlador para mostrar la imagen de un usuario o producto.
 * @param { Object } req - El objeto de solicitud que contiene los parámetros de la URL.
 * @param { Object } res - El objeto de respuesta para enviar el resultado.
 * @returns { Object } Devuelve la imagen del usuario o producto.
 * @returns { Object } Devuelve una imagen por defecto si no se encuentra la imagen del usuario o producto.
 */
const showImage = async (req = request, res = response) => {
  const { collection, id } = req.params;

  let model;
  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;
    case 'products':
      model = await Product.findById(id)
        if (!model) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${id}`,
          });
        }
        break;

    default: 
      return res.status(500).json({ msg: 'Se me olvido hacer esto.' });
  }

  if (model.img) {
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathImage)) {
      return res.sendFile(pathImage);
    }
  }

  const pathImage = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathImage);
};

export { showImage, uploadFile, updateImage, updateImageCloudinary };
