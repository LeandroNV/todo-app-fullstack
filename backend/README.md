# Todo App - Backend API

Backend para la aplicación de gestión de tareas, construido con Node.js, Express, TypeScript y MongoDB.

## 🚀 Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Superset de JavaScript con tipado
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Configurar variables de entorno
# Editar .env con tus configuraciones
```

## ⚙️ Configuración

Crear archivo `.env` basado en `.env.example`:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/todoapp
CORS_ORIGIN=http://localhost:5173
```

## 🏃 Ejecución

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Compilar TypeScript
npm run build

# Modo producción
npm start
```

## 📡 Endpoints de la API

### Tareas

- `GET /api/todos` - Obtener todas las tareas
  - Query params: `?status=completed|pending&priority=low|medium|high`
- `GET /api/todos/:id` - Obtener una tarea por ID
- `POST /api/todos` - Crear nueva tarea
- `PUT /api/todos/:id` - Actualizar tarea completa
- `PATCH /api/todos/:id/toggle` - Cambiar estado completado/pendiente
- `DELETE /api/todos/:id` - Eliminar tarea

### Estadísticas

- `GET /api/stats` - Obtener estadísticas de tareas

### Salud

- `GET /health` - Estado del servidor

## 📝 Modelo de Datos

```typescript
{
  _id: ObjectId,
  title: string,        // requerido, max 200 caracteres
  description: string,  // max 1000 caracteres
  completed: boolean,   // default: false
  priority: 'low' | 'medium' | 'high',  // default: 'medium'
  dueDate: Date | null,
  tags: string[],
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts      # Configuración de MongoDB
│   ├── controllers/
│   │   └── todoController.ts # Lógica de negocio
│   ├── middleware/
│   │   └── errorHandler.ts   # Manejo de errores
│   ├── models/
│   │   └── Todo.ts           # Modelo de datos
│   ├── routes/
│   │   └── todoRoutes.ts     # Definición de rutas
│   ├── types/
│   │   └── index.ts          # Tipos TypeScript
│   └── server.ts             # Punto de entrada
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Requisitos

- Node.js >= 20.x
- MongoDB >= 6.x

## 🐳 MongoDB con Docker

Si no tienes MongoDB instalado, puedes usar Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:7-alpine
```

