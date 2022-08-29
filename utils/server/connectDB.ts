import { Db, MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI as string

const client = new MongoClient(uri)

let db: Db | null = null

export const connectDB = async () => {
  if (db === null) {
    try {
      await client.connect()
      db = await client.db('cxy-home')
    } catch (e) {
      await client.close()
    }
  }
  return db
}