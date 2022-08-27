// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { runMiddleware } from '@utils/server/runMiddleware'
import jwt from 'jsonwebtoken'



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
