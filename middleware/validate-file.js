import { request, response } from 'express';

/**
 * @name validateFileUpload
 * @description Middleware para validar que se suban archivos.
 * @param { Object } req - El objeto de solicitud.
 * @param { Object } res - El objeto de respuesta.
 * @param { Function } next - Callback que se ejecuta para pasar al siguiente middleware.
 * @returns { Object } Devuelve un objeto con un mensaje de error si no se suben archivos.
 */
const validateFileUpload = (req = request, res = response, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    return res.status(400).json({ msg: 'No hay archivos para subir.' });
  }

  next();
};

export { validateFileUpload };
