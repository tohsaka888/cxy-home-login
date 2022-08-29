// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { runMiddleware } from '@utils/server/runMiddleware'
import { connectDB } from '@utils/server/connectDB'

/**
 * @openapi
 * /api/register:
 *   post:
 *     description: 注册
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
 *               username:
 *                 type: string
 *                 description: 用户名
 *             required:
 *               - email
 *               - password
 *             example:
 *               email: 156132264@qq.com
 *               password: 123456
 *               username: tohsaka888
 *     responses:
 *       200:
 *         description: 返回是否注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 isRegister: 
 *                   type: boolean
 *         example:
 *           success: true
 *           isRegister: true
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

      const body: API.RegisterProps = req.body

      const result = await users.insertOne({ ...body })
      res.status(200).json({ success: true, isRegister: result.insertedId ? true : false })
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
