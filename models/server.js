import express from 'express';
import cors from 'cors';
import usersRoutes from '../routes/users.js';

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
    this.usersPath = '/api/users';

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
  };

  // Middlewares
  /**
   * @name middlewares
   * @description Agrega middlewares necesarios para el funcionamiento del server.
   * @returns { void } No devuelve nada.
   */
  middlewares() {
    // CORS
    this.app.use( cors() );
    
    // Public Directory
    this.app.use( express.static( 'public' ) );
  };

  // Define the routes
  /**
   * @name routes
   * @description Agrega las rutas necesarias para el funcionamiento del server.
   * @returns { void } No devuelve nada.
   */
  routes() {
    this.app.use( this.usersPath, usersRoutes );
  };

  // Start the server
  /**
   * @name listen
   * @description Inicia el server en el puerto especificado o en el puerto 3000 por defecto.
   * @returns { void } No devuelve nada.
   */
  listen() {
    this.app.listen( this.port, () => {
      console.log( `Server is running on port ${ this.port }` );
    });
  };
};

export default Server;