import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
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

export { uploadFile, updateImage };
