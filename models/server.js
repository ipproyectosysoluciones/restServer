import express from 'express';

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
    this.port = process.env.PORT;

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
    // Public Directory
    this.app.use( express.static( 'public' ) );
  };

  // Define the routes
  /**
   * @name routes
   * @description Agrega las rutas necesarias para el funcionamiento del server.
   * @returns { void } No devuelve nada. 1. GET /api: Devuelve un mensaje de texto. 2. PUT /api: Devuelve un mensaje de texto. 3. POST /api: Devuelve un mensaje de texto. 4. DELETE /api: Devuelve un mensaje de texto. 5. Todas las rutas definidas anteriormente son manejadas por esta función
   */
  routes() {
    this.app.get( '/api', ( req, res ) => {
      res.json({
        msg: 'get API',
      });
    });

    this.app.put( '/api', ( req, res ) => {
      res.json({
        msg: 'put API',
      });
    });

    this.app.post( '/api', ( req, res ) => {
      res.json({
        msg: 'post API',
      });
    });

    this.app.delete( '/api', ( req, res ) => {
      res.json({
        msg: 'delete API',
      });
    });
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