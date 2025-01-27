import mongoose from 'mongoose';

// Connect to MongoDB
/**
 * @name dbConnection
 * @description Conecta al motor de base de datos MongoDB.
 * @returns { Promise<void> } Devuelve una promesa que se resuelve cuando la conexión se realiza correctamente.
 */
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);

    console.log('DB OnLine!!...');
  } catch (error) {
    console.error(error);
    throw new Error('Error al iniciar la DB!!');
  }
};

export { dbConnection };
