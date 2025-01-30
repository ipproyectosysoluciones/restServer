import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Get the directory path in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @name upload_File
 * @description Sube un archivo al servidor.
 * @param { Object } files - El objeto que contiene el archivo a subir.
 * @param { Array<string> } validExtensions - Las extensiones permitidas para subir archivos.
 * @param { string } folder - La carpeta donde se guardará el archivo.
 * @returns { Promise<string> } Devuelve una promesa con la ruta del archivo subido.
 */
const upload_File = (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {
  
  return new Promise((resolve, reject) => {

    const { file } = files;
    const nameCut = file.name.split('.');
    const extension = nameCut[nameCut.length - 1];

    // Validar la extensión del archivo
    if (!validExtensions.includes(extension)) {
      return reject(`La extensión ${extension} no es permitida, las extensiones pertimidas son: ${validExtensions}.`);
    }

    const tempName = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads/',folder, tempName);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(tempName);
    });
  });
};

export {
  upload_File,
};