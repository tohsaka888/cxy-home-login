import { Db, MongoClient } from 'mongodb'

const uri = process.env.mongoUri as string

const client = new MongoClient(uri)

let db: Db | null = null

export const connectDB = async () => {
  if (db === null) {
    try {
      await client.connect()
      db = await client.db('cxy-home')
    } catch {
      await client.close()
    }
  }
  return db
}