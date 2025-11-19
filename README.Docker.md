# 🐳 Docker - Guía de Uso

## 🚀 Inicio Rápido

### Requisitos Previos

- Docker Desktop instalado
- Docker Compose v2.0+

### Ejecutar la aplicación

```bash
# Iniciar todos los servicios
docker compose up

# O en modo background (detached)
docker compose up -d

# Ver logs
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
```

### Acceder a la aplicación

- **Frontend**: http://localhost
- **API Backend**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health
- **MongoDB**: localhost:27017

### Detener la aplicación

```bash
# Detener contenedores
docker compose stop

# Detener y eliminar contenedores
docker compose down

# Detener, eliminar contenedores y volúmenes (¡CUIDADO! Elimina los datos)
docker compose down -v
```

## 📦 Servicios

### Frontend (Vue 3 + Nginx)

- **Puerto**: 80
- **Imagen base**: node:20-alpine (build), nginx:alpine (runtime)
- **Build**: Multi-stage para optimizar tamaño
- **Healthcheck**: Verificación HTTP cada 30s

### Backend (Node.js + Express)

- **Puerto**: 3000
- **Imagen base**: node:20-alpine
- **Usuario**: non-root (nodejs:1001)
- **Healthcheck**: Endpoint /health cada 30s

### MongoDB

- **Puerto**: 27017
- **Imagen**: mongo:7-alpine
- **Persistencia**: Volúmenes Docker
- **Healthcheck**: mongosh ping cada 10s

## 🔧 Comandos Útiles

### Gestión de Contenedores

```bash
# Ver estado de contenedores
docker compose ps

# Reiniciar un servicio
docker compose restart backend

# Reconstruir imágenes
docker compose build

# Reconstruir sin caché
docker compose build --no-cache

# Ver logs en tiempo real
docker compose logs -f
```

### Acceso a Contenedores

```bash
# Acceder al contenedor backend
docker compose exec backend sh

# Acceder a MongoDB
docker compose exec mongodb mongosh todoapp

# Ver archivos del frontend
docker compose exec frontend ls -la /usr/share/nginx/html
```

### Gestión de Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect todo-app_mongodb_data

# Backup de MongoDB
docker compose exec mongodb mongodump --out=/dump

# Copiar backup
docker cp todo-mongodb:/dump ./backup
```

### Gestión de Red

```bash
# Inspeccionar la red
docker network inspect todo-app_todo-network

# Ver IPs de los contenedores
docker compose exec backend ping mongodb
```

## 🐛 Troubleshooting

### Los contenedores no inician

```bash
# Ver logs detallados
docker compose logs

# Verificar que no haya conflictos de puertos
netstat -ano | findstr :80
netstat -ano | findstr :3000
netstat -ano | findstr :27017
```

### Frontend no se conecta al backend

1. Verificar que el backend esté healthy:

```bash
docker compose ps
curl http://localhost:3000/health
```

2. Verificar logs del backend:

```bash
docker compose logs backend
```

3. Verificar configuración de CORS en backend/.env

### MongoDB no conecta

```bash
# Verificar que MongoDB esté corriendo
docker compose ps mongodb

# Ver logs de MongoDB
docker compose logs mongodb

# Probar conexión manualmente
docker compose exec backend node -e "require('mongoose').connect('mongodb://mongodb:27017/todoapp').then(() => console.log('OK'))"
```

### Healthcheck falla

```bash
# Ver detalles del healthcheck
docker inspect todo-backend --format='{{json .State.Health}}'

# Ver últimos checks
docker inspect todo-backend --format='{{range .State.Health.Log}}{{.Output}}{{end}}'
```

## 🔒 Seguridad

### Buenas Prácticas Implementadas

- ✅ Usuario non-root en el backend
- ✅ Imágenes Alpine (superficie de ataque reducida)
- ✅ Multi-stage builds (menos capas)
- ✅ .dockerignore para evitar copiar archivos sensibles
- ✅ Healthchecks configurados
- ✅ Variables de entorno para configuración

### Recomendaciones Adicionales

- No exponer MongoDB en producción (eliminar puerto 27017)
- Usar Docker secrets para credenciales
- Escanear imágenes con Trivy:

```bash
trivy image todo-frontend:latest
```

## 📊 Estadísticas

### Tamaños de Imagen

```bash
docker images | grep todo

# Aproximado:
# todo-frontend   ~45MB   (nginx + archivos estáticos)
# todo-backend    ~180MB  (node + dependencias)
# mongo:7-alpine  ~150MB
```

### Recursos

```bash
# Ver uso de recursos
docker stats

# Limitar recursos en docker-compose.yml:
# deploy:
#   resources:
#     limits:
#       cpus: '0.5'
#       memory: 512M
```

## 🚀 Producción

### Variables de Entorno para Producción

Crear archivo `.env.production`:

```env
# Backend
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://mongodb:27017/todoapp
CORS_ORIGIN=https://tudominio.com

# Frontend
VITE_API_URL=https://api.tudominio.com
```

### Docker Compose para Producción

```bash
# Usar archivo de producción
docker compose -f docker-compose.prod.yml up -d

# Con variables de entorno
docker compose --env-file .env.production up -d
```

### Registry Privado

```bash
# Etiquetar imágenes
docker tag todo-frontend:latest registry.tudominio.com/todo-frontend:v1.0

# Push al registry
docker push registry.tudominio.com/todo-frontend:v1.0

# Pull desde registry
docker pull registry.tudominio.com/todo-frontend:v1.0
```

## 📚 Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)

---

**¿Problemas?** Revisa los logs con `docker compose logs -f` o consulta SETUP.md
