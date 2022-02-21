import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import loggedIn from '../../../middlewares/loggedIn'
const db: any = require('../../../db/models')

const handler = nc<NextApiRequest, NextApiResponse>()
  .use(loggedIn)
  .post(async (req, res) => {
    let { userId, password } = req.body

    if (!userId || !password) {
      return res.status(400).end()
    }
    
    userId = userId.trim()
    password = password.trim()

    if (userId.indexOf(' ') != -1 || password.indexOf(' ') != -1) {
        return res.status(400).end()
    }

    const user = await db.user.findOne({ 
      where: {
        userId
      }  
    });

    password = password.trim()

    if (password.length < 6) {
        return res.status(400).end()    
    }

    if (!user) {
      return res.status(400).end();
    }
    
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return res.status(400).json({ message: 'password does not match' });
    }

    const payload = {
      userId: user.userId
    };

    const secret = process.env.JWT_SECRET ?? ''
    
    const token = jwt.sign(payload, secret, {
      expiresIn: +(process.env.TOKEN_DURATION ?? 86400)
    });

    res.setHeader('Set-Cookie', `token=${token}; Max-Age=${process.env.TOKEN_DURATION ?? 86400}; path=/; HttpOnly`)

    return res.status(200).json({ userId, email: user.email, name: user.name })
  })

export default handler