import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import { Server } from './models/index.js';
import { configureCloudinary } from './config/cloudinary.js';

// Configure Cloudinary
configureCloudinary();

// Start the server
const server = new Server();
server.listen();
