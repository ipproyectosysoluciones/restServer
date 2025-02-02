import mongoose from 'mongoose';

/**
 * @typedef {Object} DBConfig
 * @property {Object} connectionOptions - Opciones de conexión a MongoDB
 * @property {number} maxRetries - Número máximo de intentos de conexión
 * @property {number} retryDelay - Tiempo entre reintentos en milisegundos
 */

const DB_CONFIG = {
  connectionOptions: {
    maxPoolSize: 10,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 15000,
    family: 4, // 0 = Acepta IPv4 e IPv6, 4 = solo IPv4, 6 = solo IPv6
    heartbeatFrequencyMS: 10000,
    minPoolSize: 0,
    maxIdleTimeMS: 30000,
    waitQueueTimeoutMS: 10000,
  },
  maxRetries: 3,
  retryDelay: 5000,
};

/**
 * @name setupMongooseEvents
 * @description Configura los eventos de la conexión MongoDB
 */
const setupMongooseEvents = () => {
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      process.exit(1);
    }
  });
};

/**
 * @name dbConnection
 * @description Establece conexión a MongoDB con reintentos
 * @returns {Promise<void>} Promesa que se resuelve cuando la conexión es exitosa
 * @throws {Error} Si la conexión falla después de todos los reintentos
 */
const dbConnection = async () => {
  let attempts = 0;

  try {
    if (!process.env.MONGODB_CNN) {
      throw new Error('MONGODB_CNN environment variable is not defined');
    }

    setupMongooseEvents();

    while (attempts < DB_CONFIG.maxRetries) {
      try {
        await mongoose.connect(
          process.env.MONGODB_CNN,
          DB_CONFIG.connectionOptions,
        );
        console.log('Database connection established successfully');
        return;
      } catch (error) {
        attempts++;
        console.warn(`Connection attempt ${attempts} failed:`, error.message);

        if (attempts < DB_CONFIG.maxRetries) {
          console.log(`Retrying in ${DB_CONFIG.retryDelay / 1000} seconds...`);
          await new Promise((resolve) =>
            setTimeout(resolve, DB_CONFIG.retryDelay),
          );
        }
      }
    }

    throw new Error(`Failed to connect after ${DB_CONFIG.maxRetries} attempts`);
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error(`Database initialization failed: ${error.message}`);
  }
};

export { dbConnection };
