import { response, request } from 'express';
import { upload_File } from '../helpers/index.js';

/**
 * @name uploadFile
 * @description Controlador para subir archivos al server.
 * @param { Object } req - El objeto de solicitud que contiene los archivos a subir.
 * @param { Object } res - El objeto de respuesta para enviar el resultado.
 * @returns { Object } Un mensaje de éxito si el archivo se subió correctamente, o un mensaje de error si no se subió el archivo.
 */
const uploadFile = async (req = request, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    res.status(400).json({ msg: 'No hay archivos para subir.' });
    return;
  }

  // Imagenes
  const name = await upload_File(req.files);

  res.json({ name });
};

export { uploadFile };
