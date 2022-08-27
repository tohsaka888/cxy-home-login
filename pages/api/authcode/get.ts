// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { runMiddleware } from '@utils/server/runMiddleware'
import { connectDB } from '@utils/server/connectDB'
import { createMail } from '@utils/server/createMail'
import mailconfig from 'config/mailconfig'



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
      const body: { email: string } = req.body

      //生成6位随机验证码
      const code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0')

      const mail = createMail({ toEmail: body.email, code })

      await authcode.updateOne({ email: body.email }, { $set: { code: code } }, { upsert: true })

      // 发送邮件
      await mailconfig.sendMail(mail)

      // 5min后自动删除
      setTimeout(() => {
        authcode.deleteOne({ email: body.email })
      }, 1000 * 60 * 5)

      res.status(200).json({ success: true, code: code })
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
