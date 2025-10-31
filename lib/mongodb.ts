import { MongoClient, Db, MongoClientOptions } from 'mongodb'

if (!process.env.MONGO_URI) {
  throw new Error('Please add your Mongo URI to .env file')
}

const uri: string = process.env.MONGO_URI

// Optimized connection pool settings for better performance
const options: MongoClientOptions = {
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 2, // Minimum number of connections in the pool
  maxIdleTimeMS: 60000, // Close connections after 1 minute of inactivity
  serverSelectionTimeoutMS: 10000, // Timeout for server selection
  socketTimeoutMS: 45000, // Socket timeout
  connectTimeoutMS: 10000, // Connection timeout
  retryWrites: true, // Automatically retry failed writes
  retryReads: true, // Automatically retry failed reads
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the client across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await clientPromise
  const db = client.db('sabit-real-estate')
  return { client, db }
}

export default clientPromise
