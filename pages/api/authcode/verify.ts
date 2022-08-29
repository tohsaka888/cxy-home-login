// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { runMiddleware } from '@utils/server/runMiddleware'
import { connectDB } from '@utils/server/connectDB'

/**
 * @openapi
 * /api/authcode/verify:
 *   post:
 *     description: 验证邮箱验证码
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 邮箱
 *               code:
 *                 type: string
 *                 description: 邮箱验证码
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: 156132264@qq.com
 *               code: 123456
 *     responses:
 *       200:
 *         description: 返回是否能注册
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 canRegister: 
 *                   type: boolean
 *         example:
 *           success: true
 *           canRegister: true    
 */

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

      const body: API.AuthCodeProps = req.body

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
