// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { runMiddleware } from '@utils/server/runMiddleware'
import jwt from 'jsonwebtoken'

/**
 * @openapi
 * /api/login/status:
 *   post:
 *     description: 获取登录状态
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: 登录凭据
 *             required:
 *               - token
 *             example:
 *               token: xxxxxxxxx
 *     responses:
 *       200:
 *         description: 返回登录状态
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: 
 *                   type: boolean
 *                 isLogin: 
 *                   type: boolean
 *                 username:
 *                   type: string
 *         example:
 *           success: true
 *           isLogin: true
 *           username: tohsaka888
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

    const body: { token: string } = req.body
    
    const result = jwt.verify(body.token, process.env.secret as string)

    res.status(200).json({ success: true, isLogin: result ? true : false, result })

  } catch (error: any) {
    res.status(200).send({
      success: false,
      error: (error as Error).message
    })
  }
}
