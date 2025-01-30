import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { response, request } from 'express';

// Get the directory path in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @name uploadFile
 * @description Controlador para subir archivos al server.
 * @param { Object } req - El objeto de solicitud que contiene los archivos a subir.
 * @param { Object } res - El objeto de respuesta para enviar el resultado.
 * @returns { Object } Un mensaje de éxito si el archivo se subió correctamente, o un mensaje de error si no se subió el archivo.
 */
const uploadFile = (req = request, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    res.status(400).json({ msg: 'No hay archivos para subir.' });
    return;
  }

  const { file } = req.files;
  const nameCut = file.name.split('.');
  const extension = nameCut[nameCut.length - 1];

  // Validar la extensión del archivo
  const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

  if (!validExtensions.includes(extension)) {
    return res
      .status(400)
      .json({
        msg: `La extensión ${extension} no es permitida, las extensiones pertimidas son: ${validExtensions}.`,
      });
  }

  const tempName = uuidv4() + '.' + extension;
  const uploadPath = path.join(__dirname, '../uploads/', tempName);

  file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).json({ err });
    }

    res.json({ msg: `Archivo subido correctamente ${uploadPath}` });
  });
};

export { uploadFile };
