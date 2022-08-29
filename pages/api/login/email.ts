// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { runMiddleware } from '@utils/server/runMiddleware'
import { connectDB } from '@utils/server/connectDB'
import { generateAccessToken } from '@utils/server/generateAccessToken'

/**
 * @openapi
 * /api/login/email:
 *   post:
 *     description: 邮箱登录
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
 *               password:
 *                 type: string
 *                 description: 密码
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: 156132264@qq.com
 *               password: swy156132264
 *     responses:
 *       200:
 *         description: 返回是否登录成功和token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 token: 
 *                   type: string
 *                 canLogin:
 *                   type: boolean
 *         example:
 *           success: true
 *           token: xxxxxxxxx
 *           canLogin: false
 *               
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
      const users = await db.collection('users')

      const body: { email: string; password: string } = req.body
      const result = await users.findOne({ ...body })
      const token = generateAccessToken(result?.username || '')

      res.status(200).json({ success: true, canLogin: result ? true : false, token })
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
