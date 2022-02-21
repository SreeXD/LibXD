import type { NextApiResponse } from 'next'
import nc from 'next-connect'
import { Op } from 'sequelize'

import type { NextApiRequestWithSession } from '../../../utils/NextApiRequestWithSession'
import authMiddleware from '../../../middlewares/auth'
let db: any = require('../../../db/models')

const handler = nc<NextApiRequestWithSession, NextApiResponse>()
    .use(authMiddleware)    
    .get(async (req, res) => {
        const userId = req.session.userId
        let { after, before, limit, search } = req.query 
        limit = limit ?? 50

        if (after && before) {
            return res.status(400).end()
        }

        if (limit && isNaN(+limit)) {
            return res.status(400).end()
        }

        const query: any = {
            where: {},
            limit: +limit,
            order: [
                [ 'admNo', 'asc' ]
            ]
        }

        if (search) {
            query.where[Op.or] = {
                admNo: {
                    [Op.like]: `${search}%`
                },
                name: {
                    [Op.like]: `${search}%`
                },
            }
        }

        if (after) {
            if (isNaN(+after)) {
                return res.status(400).end()
            }

            query.where.admNo = {
                [Op.gt]: +after
            }
        }

        if (before) {
            if (isNaN(+before)) {
                return res.status(400).end()
            }

            query.where.admNo = {
                [Op.lt]: +before
            }

            query.order = [
                ['admNo', 'desc']
            ]
        }
 
        const user = await db.user.findOne({
            where: {
                userId
            }
        }) 

        let students: any[] = await user.getStudents(query)

        if (before) {
            students = students.reverse()
        }

        return res.status(200).json({
            students: students.map(student => ({
                admNo: student.admNo,
                name: student.name,
                batch: student.batch,
                branch: student.branch,
                phone: student.phone
            }))
        })
    })

export default handler