// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { runMiddleware } from '@utils/server/runMiddleware'
import { connectDB } from '@utils/server/connectDB'



const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {

    // Run the middleware
    await runMiddleware(req, res, cors)
    const db = await connectDB()
    if (db) {
      // select collection
      const users = await db.collection('users')

      const body: API.RegisterProps = JSON.parse(req.body)

      await users.updateOne({ email: body.email }, { $set: { password: body.password } })
      res.status(200).json({ success: true })
    } else {
      new Error('数据库连接失败')
    }
  } catch (error: any) {
    res.status(200).send({
      success: false,
      error: (error as Error).message
    })
  }
}
