import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

const handler = nc<NextApiRequest, NextApiResponse>()
  .post(async (req, res) => {
    if (!req.cookies.token)
      return res.status(400).json({ message: 'user not signed in' })

    return res.setHeader('Set-Cookie', 'token=deleted; Max-Age=0; path=/').status(200).end()
  })

export default handler