import { clientPromise } from "./clientPromise"

export const connectDB = async () => {
  const connection = await clientPromise
  return connection.db('cxy-home')
}