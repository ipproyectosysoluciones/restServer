import dotenv from 'dotenv';
import { Server } from './models/index.js';

// Load environment variables from.env file
dotenv.config();

// Start the server
const server = new Server();

// Start the server on the specified port or 3000 by default
server.listen();