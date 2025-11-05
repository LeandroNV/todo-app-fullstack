# 📝 Todo App - Full Stack

Aplicación completa de gestión de tareas construida con Vue 3, Node.js, Express y MongoDB. Diseñada para ser fácilmente dockerizada y desplegada con Jenkins.

> 📚 **¿Primera vez aquí?** Consulta el [ÍNDICE DE DOCUMENTACIÓN](INDICE.md) para encontrar rápidamente lo que necesitas.

## 🎯 Características

- ✅ Crear, editar, eliminar y completar tareas
- 🎨 Interfaz moderna y responsive con Tailwind CSS
- 🔍 Filtros por estado (completadas/pendientes) y prioridad
- 🏷️ Sistema de etiquetas
- 📊 Dashboard con estadísticas en tiempo real
- 📅 Fechas límite para tareas
- 🎯 Tres niveles de prioridad (baja, media, alta)
- 🔄 Actualización en tiempo real

## 🛠️ Stack Tecnológico

### Frontend

- **Vue 3** - Framework progresivo de JavaScript
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de utilidades CSS
- **Vite** - Build tool y dev server

### Backend

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web minimalista
- **TypeScript** - Tipado estático
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB

## 📁 Estructura del Proyecto

```
to-do-app/
├── frontend/              # Aplicación Vue 3
│   ├── src/
│   │   ├── components/    # Componentes Vue
│   │   ├── services/      # Servicios API
│   │   ├── stores/        # Estado global
│   │   ├── types/         # Tipos TypeScript
│   │   └── App.vue        # Componente principal
│   ├── package.json
│   └── vite.config.ts
│
├── backend/               # API Node.js + Express
│   ├── src/
│   │   ├── config/        # Configuraciones
│   │   ├── controllers/   # Controladores
│   │   ├── middleware/    # Middlewares
│   │   ├── models/        # Modelos de datos
│   │   ├── routes/        # Rutas de la API
│   │   ├── types/         # Tipos TypeScript
│   │   └── server.ts      # Punto de entrada
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js >= 20.x
- MongoDB >= 6.x (o usar Docker)
- pnpm (recomendado) o npm

### 1. Instalar MongoDB (Opción Docker)

```bash
# Iniciar MongoDB con Docker
docker run -d -p 27017:27017 --name mongodb mongo:7-alpine

# Verificar que está corriendo
docker ps
```

### 2. Configurar y ejecutar el Backend

```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# El archivo .env ya está creado con valores por defecto
# Si necesitas modificarlo:
# PORT=3000
# NODE_ENV=development
# MONGODB_URI=mongodb://localhost:27017/todoapp
# CORS_ORIGIN=http://localhost:5173

# Ejecutar en modo desarrollo
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### 3. Configurar y ejecutar el Frontend

```bash
# En otra terminal, navegar al directorio raíz
cd ..

# Instalar dependencias (si no lo hiciste antes)
pnpm install

# Ejecutar en modo desarrollo
pnpm dev
```

El frontend estará disponible en `http://localhost:5173`

## 📡 API Endpoints

### Tareas

| Método | Endpoint                      | Descripción                  |
| ------ | ----------------------------- | ---------------------------- |
| GET    | `/api/todos`                  | Obtener todas las tareas     |
| GET    | `/api/todos?status=completed` | Filtrar por estado           |
| GET    | `/api/todos?priority=high`    | Filtrar por prioridad        |
| GET    | `/api/todos/:id`              | Obtener una tarea específica |
| POST   | `/api/todos`                  | Crear nueva tarea            |
| PUT    | `/api/todos/:id`              | Actualizar tarea completa    |
| PATCH  | `/api/todos/:id/toggle`       | Cambiar estado completado    |
| DELETE | `/api/todos/:id`              | Eliminar tarea               |

### Estadísticas

| Método | Endpoint     | Descripción          |
| ------ | ------------ | -------------------- |
| GET    | `/api/stats` | Obtener estadísticas |

### Salud

| Método | Endpoint  | Descripción         |
| ------ | --------- | ------------------- |
| GET    | `/health` | Estado del servidor |

## 📦 Scripts Disponibles

### Frontend

```bash
pnpm dev          # Iniciar servidor de desarrollo
pnpm build        # Compilar para producción
pnpm preview      # Previsualizar build de producción
pnpm lint         # Ejecutar linter
pnpm format       # Formatear código
```

### Backend

```bash
npm run dev       # Iniciar servidor con hot reload
npm run build     # Compilar TypeScript
npm start         # Iniciar servidor en producción
```

## 🎨 Características de la UI

- **Dashboard de estadísticas**: Visualiza el progreso de tus tareas
- **Filtros avanzados**: Por estado, prioridad y búsqueda de texto
- **Sistema de colores**: Identificación visual de prioridades
- **Diseño responsive**: Funciona en móviles, tablets y desktop
- **Indicadores visuales**: Estados claros para cada tarea
- **Experiencia fluida**: Animaciones y transiciones suaves

## 🔧 Configuración Avanzada

### Variables de Entorno

#### Frontend

Crear `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api
```

#### Backend

Ya existe `.env` en `backend/`:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/todoapp
CORS_ORIGIN=http://localhost:5173
```

## 🐳 Próximos Pasos (Docker y Jenkins)

Esta aplicación está lista para ser dockerizada. Los próximos pasos incluirán:

1. **Dockerfiles** para frontend y backend
2. **docker-compose.yml** para orquestación local
3. **Jenkinsfile** para CI/CD pipeline
4. **Configuración de staging/producción**

## 📝 Modelo de Datos

```typescript
interface Todo {
  _id: string
  title: string // Máximo 200 caracteres
  description: string // Máximo 1000 caracteres
  completed: boolean // Default: false
  priority: 'low' | 'medium' | 'high' // Default: 'medium'
  dueDate: Date | null
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
```

## 📄 Licencia

ISC

---

**Stack: Vue 3, Node.js, Express y MongoDB**
