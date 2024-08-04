import dotenv from 'dotenv';
import express from 'express';


// Load environment variables from.env file
dotenv.config();

// Create the Express app instance
const app = express();


// Define the routes
app.get( '/', ( req, res ) => {
  res.send( 'Hello World' );
});

// Start the server
app.listen( process.env.PORT, () => {
  console.log( `Server is running on port ${ process.env.PORT }` );
});