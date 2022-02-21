import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import loggedIn from '../../../../../middlewares/loggedIn'
const db: any = require('../../../../../db/models')

const handler = nc<NextApiRequest, NextApiResponse>()
    .use(loggedIn)
    .get(async (req, res) => {
        if (Array.isArray(req.query.params)) {
            return res.status(200)
        }

        const email = req.query.email;

        const user = await db.user.findOne({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(400).end()
        }

        return res.status(200).end()
    })

export default handler