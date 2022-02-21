import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { Op } from 'sequelize'

import loggedIn from '../../../middlewares/loggedIn'
const db: any = require('../../../db/models')

const handler = nc<NextApiRequest, NextApiResponse>()
    .use(loggedIn)
    .post(async (req, res) => {
        let { userId, email, name, password } = req.body;

        if (!userId || !email || !name || !password) {
            return res.status(400).end();
        }

        userId = userId.trim()
        email = email.trim()
        name = name.trim() 
        password = password.trim()

        if (userId.indexOf(' ') != -1 || email.indexOf(' ') != -1 || password.indexOf(' ') != -1) {
            return res.status(400).end()
        }

        const parts: string[] = email.split(/\.|@/)
        
        if (parts.length < 3 || parts.some(p => p == '')) {
            return res.status(400).end()
        }

        password = password.trim()

        if (password.length < 6) {
            return res.status(400).end()    
        }

        let exists = await db.user.findOne({
            where: {
                [Op.or]: [ 
                    { userId },
                    { email }
                ]
            }
        });

        if (exists) {
            return res.status(400).end()
        }

        await db.user.create({
            userId,
            email,
            name,
            password
        });

        return res.status(200).end()
    })

export default handler