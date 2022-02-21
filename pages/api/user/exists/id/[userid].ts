import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import loggedIn from '../../../../../middlewares/loggedIn'
const db: any = require('../../../../../db/models')

const handler = nc<NextApiRequest, NextApiResponse>()
    .use(loggedIn)
    .get(async (req, res) => {
        const userId = req.query.userid;

        const user = await db.user.findOne({
            where: {
                userId
            }
        })

        if (!user) {
            return res.status(400).end()
        }

        return res.status(200).end()
    })

export default handler