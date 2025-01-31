# Coffee Shop REST API

API REST para la gestión de una tienda de café, construida con Node.js, Express y MongoDB.

## Características

- Autenticación con JWT y Google Sign-in
- Gestión de usuarios con roles
- CRUD de categorías y productos
- Subida de imágenes (local y Cloudinary)
- Búsqueda flexible en colecciones
- Validaciones personalizadas
- Documentación con JSDoc

## Requisitos Previos

- Node.js v20.x o superior
- MongoDB
- Cuenta en Cloudinary (para almacenamiento de imágenes)
- Credenciales de Google OAuth2 (para autenticación)

## Instalación

1. Clonar el repositorio

```bash
git clone <repository-url>
cd restServer
```

2. Instalar dependencias

```bash
pnpm install
```

3. Configurar variables de entorno

```bash
cp .env.example .env
```

Completar el archivo `.env` con tus credenciales:

```properties
PORT=3000
MONGODB_CNN=your_mongodb_connection_string
SECRET_JWT_SEED=your_jwt_secret
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET_KEY=your_google_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Uso

### Iniciar el servidor

```bash
# Desarrollo
pnpm dev

# Producción
pnpm start
```

### Endpoints Principales

#### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/google` - Autenticación con Google

#### Usuarios

- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

#### Categorías

- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

#### Productos

- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

#### Uploads

- `POST /api/uploads` - Subir archivo
- `PUT /api/uploads/:collection/:id` - Actualizar imagen
- `GET /api/uploads/:collection/:id` - Obtener imagen

#### Búsqueda

- `GET /api/search/:collection/:term` - Buscar en colecciones

## Estructura del Proyecto

```tree
restServer/
├── assets/          # Recursos estáticos
├── config/          # Configuraciones (DB, Cloudinary)
├── controllers/     # Controladores de la API
├── database/        # Configuración de MongoDB
├── helpers/         # Funciones auxiliares
├── middlewares/     # Middlewares personalizados
├── models/          # Modelos de datos
├── public/          # Archivos públicos
├── routes/          # Definición de rutas
└── uploads/         # Almacenamiento local de archivos
```

## Características de Seguridad

- Validación de JWT
- Roles y permisos
- Sanitización de entradas
- Validación de tipos de archivo
- Protección contra inyección NoSQL
- Rate limiting

## Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
