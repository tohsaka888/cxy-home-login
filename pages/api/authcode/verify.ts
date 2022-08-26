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
      const authcode = await db.collection('authcode')

      const body: API.AuthCodeProps = JSON.parse(req.body)

      const result = await authcode.findOne({ ...body })

      res.status(200).json({ success: true, canRegister: result?._id ? true : false })
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
