# 🚀 Guía de Instalación y Ejecución

Esta guía te ayudará a poner en marcha la aplicación Todo completa paso a paso.

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 20.x - [Descargar](https://nodejs.org/)
- **pnpm** (recomendado) o npm
- **MongoDB** >= 6.x - [Descargar](https://www.mongodb.com/try/download/community)

### Instalación de pnpm (opcional pero recomendado)

```bash
npm install -g pnpm
```

## 🐳 Opción 1: MongoDB con Docker (Recomendado)

Si tienes Docker instalado, esta es la forma más rápida:

```bash
# Iniciar MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:7-alpine

# Verificar que está corriendo
docker ps

# Para detenerlo más tarde
docker stop mongodb

# Para iniciarlo nuevamente
docker start mongodb
```

## 💻 Opción 2: MongoDB Local

1. Descarga MongoDB Community Server desde [mongodb.com](https://www.mongodb.com/try/download/community)
2. Instálalo siguiendo las instrucciones para tu sistema operativo
3. Asegúrate de que el servicio MongoDB esté corriendo

**Windows:**
```powershell
# Verificar si MongoDB está corriendo
Get-Service MongoDB
```

**Linux/Mac:**
```bash
# Verificar si MongoDB está corriendo
sudo systemctl status mongod
```

## 🛠️ Instalación

### 1. Instalar dependencias del Frontend

```bash
# En el directorio raíz del proyecto
pnpm install
# o si usas npm:
npm install
```

### 2. Instalar dependencias del Backend

```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Volver al directorio raíz
cd ..
```

## ⚙️ Configuración

### Frontend

El frontend ya está configurado para conectarse a `http://localhost:3000/api`.

Si necesitas cambiar la URL de la API, crea un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000/api
```

### Backend

El backend ya tiene un archivo `.env` configurado con:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/todoapp
CORS_ORIGIN=http://localhost:5173
```

## ▶️ Ejecución

Necesitarás **DOS terminales** abiertas simultáneamente:

### Terminal 1: Backend

```bash
# Navegar al directorio backend
cd backend

# Ejecutar el servidor (con hot reload)
npm run dev
```

Deberías ver algo como:
```
✅ MongoDB conectado exitosamente
📍 Base de datos: todoapp
🚀 Servidor corriendo en http://localhost:3000
📡 API disponible en http://localhost:3000/api
🌍 Entorno: development
```

### Terminal 2: Frontend

```bash
# En el directorio raíz del proyecto
pnpm dev
# o si usas npm:
npm run dev
```

Deberías ver:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 🌐 Acceder a la Aplicación

Abre tu navegador y ve a: **http://localhost:5173**

Deberías ver:
- ✅ Indicador "Conectado" en la esquina superior derecha (en verde)
- Dashboard con estadísticas en 0
- Formulario para crear tareas
- Interface completa y responsive

## 🧪 Probar la Aplicación

### 1. Crear una tarea

1. Completa el formulario con:
   - **Título**: "Mi primera tarea"
   - **Descripción**: "Probar la aplicación"
   - **Prioridad**: Alta
   - **Fecha límite**: Hoy o mañana
   - **Etiquetas**: "prueba, demo"

2. Click en "Crear Tarea"

3. Deberías ver:
   - La tarea aparece en la lista
   - Las estadísticas se actualizan
   - Un mensaje en la consola del backend

### 2. Probar funcionalidades

- ✅ **Marcar como completada**: Click en el círculo a la izquierda
- ✏️ **Editar**: Click en el ícono de lápiz
- 🗑️ **Eliminar**: Click en el ícono de basura
- 🔍 **Filtrar**: Usa los filtros superiores
- 🔎 **Buscar**: Escribe en la barra de búsqueda

### 3. Verificar la base de datos

Puedes verificar que los datos se están guardando:

```bash
# Conectarse a MongoDB
mongosh

# Ver las bases de datos
show dbs

# Usar la base de datos de la app
use todoapp

# Ver las tareas
db.todos.find().pretty()
```

## 🔍 Solución de Problemas

### El frontend muestra "Desconectado"

1. Verifica que el backend esté corriendo (`http://localhost:3000/health`)
2. Verifica que MongoDB esté corriendo
3. Revisa la consola del navegador (F12) para ver errores
4. Revisa la terminal del backend para ver errores

### Error de conexión a MongoDB

```
❌ Error al conectar a MongoDB
```

**Solución:**
1. Verifica que MongoDB esté corriendo
2. Verifica la URL en `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/todoapp
   ```

### Puerto 3000 o 5173 ya en uso

**Backend (3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

**Frontend (5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### Errores de CORS

Si ves errores de CORS en la consola del navegador:

1. Verifica que `CORS_ORIGIN` en `backend/.env` sea correcto:
   ```
   CORS_ORIGIN=http://localhost:5173
   ```
2. Reinicia el servidor backend

## 📊 Endpoints para Pruebas Manuales

Puedes usar herramientas como Postman o curl:

```bash
# Obtener todas las tareas
curl http://localhost:3000/api/todos

# Obtener estadísticas
curl http://localhost:3000/api/stats

# Crear una tarea
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tarea de prueba",
    "description": "Descripción de prueba",
    "priority": "high",
    "tags": ["prueba"]
  }'

# Verificar salud del servidor
curl http://localhost:3000/health
```

## 🛑 Detener la Aplicación

1. En ambas terminales, presiona `Ctrl + C`
2. Si usaste Docker para MongoDB:
   ```bash
   docker stop mongodb
   ```

## 📝 Notas Adicionales

- Los datos se persisten en MongoDB, así que tus tareas permanecerán entre reinicios
- El frontend se recarga automáticamente al hacer cambios
- El backend se reinicia automáticamente al hacer cambios (gracias a `tsx watch`)

## 🎉 ¡Listo!

Tu aplicación Todo está corriendo exitosamente. Ahora estás listo para:

1. Agregar más funcionalidades
2. Dockerizar la aplicación
3. Configurar CI/CD con Jenkins
4. Desplegar en producción

---

**¿Problemas?** Verifica que:
- ✅ MongoDB esté corriendo
- ✅ Las dependencias estén instaladas en ambos proyectos
- ✅ Los puertos 3000 y 5173 estén libres
- ✅ Node.js versión >= 20.x

