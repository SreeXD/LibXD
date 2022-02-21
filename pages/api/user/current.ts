import type { NextApiResponse } from 'next'
import nc from 'next-connect'

import type { NextApiRequestWithSession } from '../../../utils/NextApiRequestWithSession'
import authMiddleware from '../../../middlewares/auth'
let db: any = require('../../../db/models')

const handler = nc<NextApiRequestWithSession, NextApiResponse>()
    .use(authMiddleware)    
    .get(async (req, res) => {
        const userId = req.session.userId

        const user = await db.user.findOne({
            where: {
                userId
            }
        }) 

        return res.status(200).json({ userId, email: user.email, name: user.name })
    })

export default handler