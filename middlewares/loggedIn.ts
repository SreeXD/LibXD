import type { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import jwt from 'jsonwebtoken'

const loggedIn = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const token = req.cookies.token

    if (!token) {
        return next()
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET ?? '')

        return res.status(400).json({ message: 'user already logged in' })
    }

    catch(error: any) { }
    
    return next()
}

export default loggedIn 