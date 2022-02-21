import type { NextApiResponse } from 'next'
import nc from 'next-connect'

import type { NextApiRequestWithSession } from '../../../../utils/NextApiRequestWithSession'
import authMiddleware from '../../../../middlewares/auth'
let db: any = require('../../../../db/models')

const handler = nc<NextApiRequestWithSession, NextApiResponse>()
    .use(authMiddleware)    
    .get(async (req, res) => {
        const userId = req.session.userId
        const { id } = req.query

        const student = await db.student.findOne({
            where: {
                id
            }
        })

        if (!student) {
            return res.status(404).end()
        }

        if (student.userId != userId) {
            return res.status(403).end()
        }

        return res.status(200).json({
            admNo: student.admNo,
            name: student.name,
            batch: student.batch,
            branch: student.branch,
            phone: student.phone
        })
    })

export default handler