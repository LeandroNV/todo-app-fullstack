# ⚡ Inicio Rápido - Todo App

## 📦 Estado del Proyecto

✅ **Frontend**: Completamente desarrollado y listo
✅ **Backend**: API completa con Node.js + Express
✅ **Base de Datos**: Configuración lista para MongoDB
✅ **Dependencias Backend**: Instaladas

## 🎯 Siguiente Paso: Instalar MongoDB

### Opción 1: Instalar MongoDB Localmente (Recomendado para Windows)

1. **Descargar MongoDB Community Server**
   - Ve a: https://www.mongodb.com/try/download/community
   - Selecciona tu versión de Windows
   - Descarga e instala siguiendo el asistente
   - ✅ Marca "Install MongoDB as a Service"
   - ✅ Marca "Install MongoDB Compass" (herramienta gráfica útil)

2. **Verificar la instalación**
   ```powershell
   mongod --version
   ```

3. **MongoDB debería estar corriendo automáticamente**
   ```powershell
   Get-Service MongoDB
   ```

### Opción 2: Instalar Docker Desktop (Para usar MongoDB en contenedor)

1. **Descargar Docker Desktop**
   - Ve a: https://www.docker.com/products/docker-desktop/
   - Descarga e instala Docker Desktop para Windows
   - Reinicia tu computadora si es necesario

2. **Iniciar MongoDB con Docker**
   ```powershell
   docker run -d -p 27017:27017 --name mongodb mongo:7-alpine
   ```

## 🚀 Ejecutar la Aplicación

Una vez que tengas MongoDB instalado:

### 1. Iniciar el Backend

```powershell
cd backend
npm run dev
```

Deberías ver:
```
✅ MongoDB conectado exitosamente
📍 Base de datos: todoapp
🚀 Servidor corriendo en http://localhost:3000
```

### 2. Iniciar el Frontend (en otra terminal)

```powershell
# Desde el directorio raíz
pnpm dev
```

### 3. Abrir en el navegador

Abre: http://localhost:5173

## ✨ ¡Eso es todo!

Tu aplicación debería estar corriendo. Ahora puedes:

- ✅ Crear tareas
- ✅ Marcar como completadas
- ✅ Editar y eliminar
- ✅ Filtrar por estado y prioridad
- ✅ Ver estadísticas en tiempo real

## 📚 Más Información

- Para instrucciones detalladas, ver: `SETUP.md`
- Para documentación completa, ver: `README.md`

## 🆘 Ayuda

Si encuentras algún problema:

1. Verifica que MongoDB esté corriendo
2. Verifica que los puertos 3000 y 5173 estén libres
3. Revisa las consolas de backend y frontend para errores
4. Consulta `SETUP.md` para solución de problemas detallada

