import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/auth.js';
import categoriesRoutes from '../routes/categories.js';
import usersRoutes from '../routes/users.js';
import { dbConnection } from '../database/config.js';

/**
 * @class
 * @name Server
 * @description Esta clase configura y administra el servidor Express.
 */
class Server {
  /**
   * @constructor
   * @description Inicializa el servidor Express con las configuraciones y middlewares necesarios.
   * @returns { Server } Devuelve una instancia de la clase Server.
   */
  constructor() {
    // Create the Express app instance
    this.app = express();

    // Server settings
    this.port = process.env.PORT;

    // Paths
    this.paths = {
      auth: '/api/auth',
      categories: '/api/categories',
      users: '/api/users',
    };

    // Connect to DB
    this.connectDB();

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
  }

  // Connect to DB
  /**
   * @name connectDB
   * @description Conecta al motor de base de datos MongoDB.
   * @returns { Promise<void> } Devuelve una promesa que se resuelve cuando la conexión se realiza correctamente.
   */
  async connectDB() {
    await dbConnection();
  }

  // Middlewares
  /**
   * @name middlewares
   * @description Agrega middlewares necesarios para el funcionamiento del server.
   * @returns { void } No devuelve nada.
   */
  middlewares() {
    // CORS
    this.app.use(cors());

    // Body parser
    this.app.use(express.json());

    // Public Directory
    this.app.use(express.static('public'));
  }

  // Define the routes
  /**
   * @name routes
   * @description Define las rutas para las diferentes endpoints.
   * @returns { void } No devuelve nada.
   */
  routes() {
    this.app.use(this.paths.auth, authRoutes);
    this.app.use(this.paths.categories, categoriesRoutes);
    this.app.use(this.paths.users, usersRoutes);
  }

  // Start the server
  /**
   * @name listen
   * @description Inicia el server en el puerto especificado o en el puerto 3000 por defecto.
   * @returns { void } No devuelve nada.
   */
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default Server;
