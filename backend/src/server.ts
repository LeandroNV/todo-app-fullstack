import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database.js'
import todoRoutes from './routes/todoRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

// Cargar variables de entorno
dotenv.config()

// Crear aplicación Express
const app = express()
const PORT = process.env.PORT || 3000
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173'

// Conectar a la base de datos
connectDB()

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Rutas de la API
app.use('/api', todoRoutes)

// Manejo de errores
app.use(notFound)
app.use(errorHandler)

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📡 API disponible en http://localhost:${PORT}/api`)
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`)
})

