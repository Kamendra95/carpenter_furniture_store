import mongoose from 'mongoose'
import { config } from './index.js'

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    return mongoose.connection
  }

  try {
    const conn = await mongoose.connect(config.db.uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    isConnected = true
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
    return conn.connection
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    throw error
  }
}

export function getConnection() {
  return mongoose.connection
}

export async function closeDB() {
  if (isConnected) {
    await mongoose.connection.close()
    isConnected = false
    console.log('MongoDB connection closed')
  }
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1
}