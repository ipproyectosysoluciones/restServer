import { v2 as cloudinary } from 'cloudinary';

/**
 * Configure Cloudinary with the environment variables.
 */
const configureCloudinary = () => {
    try {
       /** 
        * @name cloudinary
        * @description Configura Cloudinary con las credenciales de la aplicación.
        * @param { object } config - Objeto con las credenciales de Cloudinary.
        * @returns { void }
        */
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        console.log('Cloudinary configured successfully');
    } catch (error) {
        console.error('Cloudinary configuration error:', error.message);
    }
};

export { cloudinary, configureCloudinary };
