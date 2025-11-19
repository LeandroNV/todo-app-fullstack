# 🚀 Jenkins CI/CD - Guía Completa

## 📋 Tabla de Contenidos
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Pipeline](#pipeline)
- [Webhooks](#webhooks)
- [Troubleshooting](#troubleshooting)

## 🎯 Instalación

### Requisitos Previos
- Docker y Docker Compose instalados
- Java JDK 11+ (si instalación nativa)
- 4GB RAM disponible
- Puerto 8080 libre

### Opción 1: Jenkins en Docker (Recomendado)

```bash
# 1. Crear volumen para datos persistentes
docker volume create jenkins_home

# 2. Ejecutar Jenkins
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --restart=unless-stopped \
  jenkins/jenkins:lts

# 3. Ver logs
docker logs -f jenkins

# 4. Obtener contraseña inicial
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Opción 2: Jenkins con Docker Compose

Crear `jenkins-docker-compose.yml`:

```yaml
version: '3.8'

services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    privileged: true
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker
    environment:
      - DOCKER_HOST=unix:///var/run/docker.sock
    restart: unless-stopped

volumes:
  jenkins_home:
    driver: local
```

Ejecutar:
```bash
docker compose -f jenkins-docker-compose.yml up -d
```

## ⚙️ Configuración Inicial

### 1. Acceder a Jenkins

1. Abrir: http://localhost:8080
2. Pegar la contraseña inicial
3. Seleccionar "Install suggested plugins"
4. Crear usuario administrador
5. Confirmar Jenkins URL

### 2. Instalar Plugins Necesarios

`Manage Jenkins` → `Manage Plugins` → `Available`

Instalar:
- ✅ Docker Pipeline
- ✅ Docker plugin
- ✅ GitHub Integration Plugin
- ✅ NodeJS Plugin
- ✅ Timestamper
- ✅ Workspace Cleanup Plugin
- ✅ Blue Ocean (opcional, mejor UI)

### 3. Configurar Node.js

`Manage Jenkins` → `Global Tool Configuration`

**NodeJS:**
- Name: `NodeJS 20`
- Install automatically: ✅
- Version: `NodeJS 20.x`

### 4. Configurar Docker en Jenkins

```bash
# Entrar al contenedor
docker exec -u root -it jenkins bash

# Instalar Docker CLI
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Dar permisos al usuario jenkins
usermod -aG docker jenkins

# Verificar
docker --version

# Salir y reiniciar
exit
docker restart jenkins
```

## 🔐 Configurar Credenciales

### GitHub Credentials

1. **En GitHub:**
   - Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Scopes: `repo`, `admin:repo_hook`, `workflow`
   - Copiar el token

2. **En Jenkins:**
   - `Manage Jenkins` → `Manage Credentials`
   - `(global)` → `Add Credentials`
   - Kind: `Username with password`
   - Username: tu usuario de GitHub
   - Password: el Personal Access Token
   - ID: `github-credentials`
   - Description: `GitHub PAT`

### Docker Hub Credentials

1. **En Docker Hub:**
   - Account Settings → Security → New Access Token
   - Description: `Jenkins CI`
   - Access permissions: `Read, Write`
   - Copiar el token

2. **En Jenkins:**
   - `Manage Credentials` → `Add Credentials`
   - Kind: `Username with password`
   - Username: tu usuario de Docker Hub
   - Password: el Access Token
   - ID: `dockerhub-credentials`
   - Description: `Docker Hub Token`

## 📝 Crear el Job

### 1. Nuevo Item

- Click en `New Item`
- Name: `todo-app-fullstack`
- Type: `Pipeline`
- Click `OK`

### 2. Configuración General

**General:**
- Description: `CI/CD Pipeline para Todo App`
- ✅ GitHub project
- Project url: `https://github.com/LeandroNV/todo-app-fullstack`

**Build Triggers:**
- ✅ GitHub hook trigger for GITScm polling

**Pipeline:**
- Definition: `Pipeline script from SCM`
- SCM: `Git`
- Repository URL: `https://github.com/LeandroNV/todo-app-fullstack.git`
- Credentials: seleccionar `github-credentials`
- Branch: `*/main`
- Script Path: `Jenkinsfile`

### 3. Guardar

Click en `Save`

## 🔗 Configurar Webhook en GitHub

### Opción 1: Servidor Público (Producción)

1. Ve a tu repositorio en GitHub
2. `Settings` → `Webhooks` → `Add webhook`
3. **Payload URL:** `http://TU_SERVIDOR:8080/github-webhook/`
4. **Content type:** `application/json`
5. **Events:** "Just the push event"
6. ✅ Active
7. `Add webhook`

### Opción 2: Ngrok (Desarrollo Local)

```bash
# Instalar ngrok
# Windows: descargar de https://ngrok.com/download
# Linux: snap install ngrok

# Crear túnel
ngrok http 8080

# Copiar la URL (ej: https://abc123.ngrok.io)
# Usar como Payload URL: https://abc123.ngrok.io/github-webhook/
```

### Opción 3: Poll SCM (Sin Webhook)

En la configuración del Job:

**Build Triggers:**
- ✅ Poll SCM
- Schedule: `H/5 * * * *` (cada 5 minutos)

## 🚀 Ejecutar el Pipeline

### Ejecución Manual

1. Ir al job `todo-app-fullstack`
2. Click en `Build Now`
3. Ver progreso en `Build History`
4. Click en el número de build → `Console Output`

### Ejecución Automática

Hacer push al repositorio:
```bash
git add .
git commit -m "test: Trigger Jenkins pipeline"
git push origin main
```

Jenkins detectará el cambio y ejecutará automáticamente.

## 📊 Monitorear el Pipeline

### Vista de Stages

- Click en el build número
- Tab `Pipeline Steps` o `Stage View`
- Ver tiempo de cada stage
- Click en stage para ver logs

### Blue Ocean (Opcional)

- Instalar plugin Blue Ocean
- Click en `Open Blue Ocean` en el menú
- Vista moderna y visual del pipeline

## 🔧 Troubleshooting

### Error: Permission Denied (Docker)

**Problema:**
```
Got permission denied while trying to connect to the Docker daemon socket
```

**Solución:**
```bash
docker exec -u root -it jenkins bash
usermod -aG docker jenkins
exit
docker restart jenkins
```

### Error: npm install fails

**Problema:**
```
ERESOLVE unable to resolve dependency tree
```

**Solución:** Ya está en el Jenkinsfile:
```groovy
sh 'npm install --legacy-peer-deps'
```

### Error: Docker command not found

**Problema:**
```
docker: command not found
```

**Solución:**
```bash
docker exec -u root -it jenkins bash
apt-get update
apt-get install -y docker.io
exit
docker restart jenkins
```

### Error: Port 8080 already in use

**Solución 1:** Cambiar puerto
```bash
docker run -p 8081:8080 -p 50000:50000 ...
```

**Solución 2:** Liberar puerto
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux
lsof -ti:8080 | xargs kill -9
```

### Webhook no funciona

**Verificar:**
1. Jenkins es accesible desde internet (usar ngrok si es local)
2. URL del webhook termina en `/github-webhook/`
3. Credenciales de GitHub están configuradas
4. Repositorio es correcto

**Alternativa:** Usar Poll SCM

### Build muy lento

**Optimizaciones:**
1. Usar caché de npm:
```groovy
sh 'npm ci' // en lugar de npm install
```

2. Builds paralelos (ya implementado)

3. Cleanup de imágenes antiguas (ya implementado)

### Pipeline falla en Tests

**Solución:** Ya implementado con `catchError`
```groovy
catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
    sh 'npm test || true'
}
```

## 📈 Mejores Prácticas

### 1. Versionado de Imágenes

✅ Ya implementado:
```groovy
IMAGE_TAG = "${BUILD_NUMBER}"
```

Cada build genera tags únicos: `1`, `2`, `3`, etc.

### 2. Cleanup Automático

✅ Ya implementado en `post`:
```groovy
always {
    sh 'docker image prune -f'
}
```

### 3. Healthchecks

✅ Ya implementado:
```groovy
sh 'curl -f http://localhost:3000/health'
```

### 4. Retry en operaciones críticas

✅ Ya implementado:
```groovy
retry(3) {
    sh 'curl -f http://localhost:3000/health'
}
```

### 5. Notificaciones

Agregar al `post`:
```groovy
success {
    mail to: 'equipo@example.com',
         subject: "Build #${BUILD_NUMBER} - SUCCESS",
         body: "El build fue exitoso"
}
```

## 📚 Comandos Útiles

```bash
# Ver logs de Jenkins
docker logs -f jenkins

# Reiniciar Jenkins
docker restart jenkins

# Backup de Jenkins
docker cp jenkins:/var/jenkins_home ./jenkins_backup

# Restaurar Jenkins
docker cp ./jenkins_backup jenkins:/var/jenkins_home

# Ver builds activos
docker exec jenkins cat /var/jenkins_home/jobs/*/builds/*/log

# Limpiar workspace
docker exec jenkins rm -rf /var/jenkins_home/workspace/*
```

## 🔐 Seguridad

### Recomendaciones:

1. **Cambiar contraseña admin** después de la instalación
2. **Habilitar autenticación** de matriz
3. **Restringir permisos** por usuario
4. **Usar HTTPS** en producción
5. **Actualizar** Jenkins regularmente
6. **No exponer** puerto 50000 públicamente
7. **Usar secrets** para credenciales sensibles

### Configurar HTTPS:

```bash
# Generar certificado
openssl req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 365 -out certificate.pem

# Configurar en Jenkins
# Manage Jenkins → Configure System → Jenkins Location
# Jenkins URL: https://tu-dominio.com
```

## 📖 Recursos

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Docker Plugin](https://plugins.jenkins.io/docker-plugin/)
- [GitHub Integration](https://plugins.jenkins.io/github/)

---

**¿Problemas?** Consulta los logs de Jenkins o revisa la sección de Troubleshooting.

**¡Pipeline listo para producción!** 🎉

