// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { runMiddleware } from '@utils/server/runMiddleware'
import { connectDB } from '@utils/server/connectDB'
import { generateAccessToken } from '@utils/server/generateAccessToken'

/**
 * @openapi
 * /api/login/username:
 *   post:
 *     description: 用户名登录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *             required:
 *               - username
 *               - password
 *             example:
 *               username: tohsaka888
 *               password: 123456
 *     responses:
 *       200:
 *         description: 返回是否登录成功,token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 canLogin: 
 *                   type: boolean
 *                 token:
 *                   type: string
 *         example:
 *           success: true
 *           canLogin: true
 *           token: xxxxxxxxxxxxxxxxxx
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
    console.log(req.body)
    if (db) {
      // select collection
      const users = await db.collection('users')

      const body: { username: string; password: string } = req.body

      const result = await users.findOne({ ...body })
      const token = generateAccessToken({ email: result?.email, username: result?.username })

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
