import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { routes } from '../routes/index.js';
import { dbConnection } from '../database/config.js';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    
    // Definición centralizada de rutas
    this.paths = {
      auth: '/api/auth',
      categories: '/api/categories',
      products: '/api/products',
      search: '/api/search',
      uploads: '/api/uploads',
      users: '/api/users',
    };

    this.initialize();
  }

  /**
   * Inicializa todos los componentes del servidor
   */
  async initialize() {
    try {
      await this.connectDB();
      this.middlewares();
      this.routes();
      console.log('✓ Server initialized successfully');
    } catch (error) {
      console.error('✗ Server initialization failed:', error);
      process.exit(1);
    }
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS con opciones de seguridad
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Parser JSON con límite
    this.app.use(express.json({ limit: '10mb' }));

    // Archivos estáticos
    this.app.use(express.static('public'));

    // Configuración de subida de archivos
    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true,
      limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
    }));
  }

  routes() {
    // Montaje de rutas usando el objeto routes centralizado
    Object.entries(this.paths).forEach(([key, path]) => {
      this.app.use(path, routes[key]);
    });

    // Manejo de rutas no encontradas
    this.app.use('*', (req, res) => {
      res.status(404).json({ 
        msg: `Route ${req.originalUrl} not found`
      });
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`✓ Server running on port ${this.port}`);
    });
  }
}

export default Server;
