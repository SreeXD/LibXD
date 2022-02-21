import type { NextApiResponse } from 'next'
import nc from 'next-connect'

import type { NextApiRequestWithSession } from '../../../utils/NextApiRequestWithSession'
import authMiddleware from '../../../middlewares/auth'

const db: any = require('../../../db/models')

const handler = nc<NextApiRequestWithSession, NextApiResponse>()
    .use(authMiddleware)
    .post(async (req, res) => {
        const {  
            admNo,
            name, 
            branch,
            batch,
            phone
        } = req.body;

        if (!admNo || !name || !branch || !batch || !phone) {
            return res.status(400).end()
        }

        if (name.match(/[0-9]|[!@#$%^&*()<>?,./]/)) {
            return res.status(400).end()
        }

        const userId = req.session.userId

        const student = await db.student.findOne({
            where: {
                userId,
                admNo 
            }
        })

        if (student) {
            return res.status(400).json({ message: `student with admission number ${admNo} already exists` })
        }

        await db.student.create({
            userId,
            admNo,
            name,
            branch,
            batch,
            phone
        })

        return res.status(200).end()
    })

export default handler