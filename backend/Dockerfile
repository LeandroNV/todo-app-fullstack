# Dockerfile para Backend (Node.js + Express)
FROM node:20-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache tzdata

# Establecer zona horaria
ENV TZ=America/Bogota

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar archivos de TypeScript y configuración
COPY tsconfig.json ./
COPY src ./src

# Instalar TypeScript y dependencias de desarrollo temporalmente para compilar
RUN npm install --save-dev typescript @types/node @types/express @types/cors && \
    npm run build && \
    npm uninstall typescript @types/node @types/express @types/cors

# Eliminar archivos fuente (solo necesitamos el código compilado)
RUN rm -rf src tsconfig.json

# Crear usuario no-root para mayor seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Cambiar permisos
RUN chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar la aplicación
CMD ["node", "dist/server.js"]

