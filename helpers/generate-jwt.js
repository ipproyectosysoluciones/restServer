import jwt from 'jsonwebtoken';

/**
 * @name generateJWT
 * @description Genera un token JWT para un usuario dado su ID.
 * @param { string } uid ID del usuario.
 * @returns { Promise<string> } Devuelve el token JWT generado.
 */
const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: '4h',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('No se pudo generar el Token');
        } else {
          resolve(token);
        }
      },
    );
  });
};

export { generateJWT };
