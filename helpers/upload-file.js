import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const UPLOAD_CONFIG = {
  validExtensions: ['png', 'jpg', 'jpeg', 'gif'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  uploadDir: path.join(__dirname, '../uploads')
};

/**
 * @name validateFile
 * @throws {Error} Si el archivo no cumple con los requisitos
 */
const validateFile = (file, validExtensions) => {
  if (!file) {
    throw new Error('No se proporcionó ningún archivo');
  }

  const extension = file.name.split('.').pop().toLowerCase();
  if (!validExtensions.includes(extension)) {
    throw new Error(`Extensión no permitida. Válidas: ${validExtensions.join(', ')}`);
  }

  if (file.size > UPLOAD_CONFIG.maxFileSize) {
    throw new Error(`Tamaño máximo permitido: ${UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB`);
  }
};

/**
 * @name uploadFile
 * @description Sube un archivo al servidor de forma segura
 */
const uploadFile = async (files, validExtensions = UPLOAD_CONFIG.validExtensions, folder = '') => {
  try {
    const { file } = files;
    validateFile(file, validExtensions);

    // Crear directorio si no existe
    const uploadPath = path.join(UPLOAD_CONFIG.uploadDir, folder);
    await fs.mkdir(uploadPath, { recursive: true });

    // Generar nombre único
    const extension = file.name.split('.').pop().toLowerCase();
    const fileName = `${uuidv4()}.${extension}`;
    const finalPath = path.join(uploadPath, fileName);

    // Mover archivo
    return new Promise((resolve, reject) => {
      file.mv(finalPath, (error) => {
        if (error) {
          console.error('Error moviendo archivo:', error);
          reject(new Error('Error al guardar el archivo'));
          return;
        }
        resolve(fileName);
      });
    });

  } catch (error) {
    console.error('Error en uploadFile:', error);
    throw error;
  }
};

export { uploadFile };