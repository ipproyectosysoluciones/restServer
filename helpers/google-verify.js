import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();

/**
 * @name googleVerify
 * @description Verifica un token de Google y devuelve la información del usuario.
 * @param { string } token - Token de Google a verificar.
 * @returns { Promise<Object> } Devuelve la información del usuario verificada.
 */
async function googleVerify(token = '') {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_ID,
    // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const { email, name, picture } = ticket.getPayload();

  return {
    email,
    name,
    img: picture,
  };
}
// verify().catch( console.error );

export { googleVerify };
