import app from './app.js'
import { config, validateConfig } from './config/index.js'
import { connectDB, closeDB } from './config/database.js'

async function startServer() {
  try {
    console.log('Connecting to database...')
    await connectDB()
    console.log('Database connected, validating config...')
    validateConfig()
    console.log('Config validated, starting server...')
  } catch (error) {
    console.error('Error during startup:', error)
    console.error('Stack:', error.stack)
    process.exit(1)
  }

  const server = app.listen(config.port, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  Carpenter Furniture Store - Backend Server                 ║
║  Running on port ${config.port}                                    ║
║  Environment: ${config.nodeEnv}                                    ║
║  API: http://localhost:${config.port}/api                           ║
╚═══════════════════════════════════════════════════════════════╝
    `)
  })

  const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`)
    server.close(async () => {
      await closeDB()
      console.log('Server closed. Database connection closed.')
      process.exit(0)
    })

    setTimeout(() => {
      console.error('Forced shutdown after 10s')
      process.exit(1)
    }, 10000)
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  process.on('SIGINT', () => gracefulShutdown('SIGINT'))
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})