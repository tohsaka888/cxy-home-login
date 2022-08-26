// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import { runMiddleware } from '@utils/server/runMiddleware'

type Data = {
  name: string
}

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  res.status(200).json({ name: 'John Doe' })
}
