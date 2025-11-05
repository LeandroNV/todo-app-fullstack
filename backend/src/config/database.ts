import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp'

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB conectado exitosamente')
    console.log(`📍 Base de datos: ${mongoose.connection.name}`)
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error)
    process.exit(1)
  }
}

// Eventos de conexión
mongoose.connection.on('error', (error) => {
  console.error('❌ Error de MongoDB:', error)
})

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB desconectado')
})

// Cerrar conexión al terminar el proceso
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('👋 Conexión de MongoDB cerrada por terminación de la aplicación')
  process.exit(0)
})

