import type { NextApiResponse } from 'next'
import nc from 'next-connect'
import sequelize, { Op } from 'sequelize'

import type { NextApiRequestWithSession } from '../../../../utils/NextApiRequestWithSession'
import authMiddleware from '../../../../middlewares/auth'
let db: any = require('../../../../db/models')

const handler = nc<NextApiRequestWithSession, NextApiResponse>()
    .use(authMiddleware)    
    .get(async (req, res) => {
        const userId = req.session.userId
        let { admNo, afterDate, afterId, beforeDate, beforeId, limit } = req.query 

        afterId = afterId ?? 0
        beforeId = beforeId ?? 0
        limit = limit ?? 50

        if (afterDate && beforeDate) {
            return res.status(400).end()
        }

        if (limit && isNaN(+limit)) {
            return res.status(400).end()
        }

        let where = `userId = '${userId}' AND admNo = '${admNo}'`

        const query: any = {
            limit: +limit,
            where: sequelize.literal(where),
            order: [
                [ 'dueDate', 'asc' ],
                [ 'id', 'asc' ]
            ]
        }

        if (afterDate) {
            query.where = sequelize.literal(`${where} AND ((dueDate = '${afterDate}' AND id > '${afterId}') OR dueDate > '${afterDate}')`)
        }

        if (beforeDate) {
            query.where = sequelize.literal(`${where} AND ((dueDate = '${beforeDate}' AND id < '${beforeId}') OR dueDate < '${beforeDate}')`)

            query.order = [
                [ 'dueDate', 'desc' ],
                [ 'id', 'desc' ]
            ]
        }

        const student = await db.student.findOne({
            where: {
                userId,
                admNo
            }
        })

        if (!student) {
            return res.status(400).end()
        } 

        let borrowed: any[] = await db.borrow.findAll(query)

        const isbns = borrowed.map(b => b.isbn)

        const books: any[] = await db.book.findAll({
            where: {
                [Op.or]: {
                    isbn: isbns
                }
            }
        })

        const booksMap: { [isbn: string]: string } = {}

        for (const book of books) {
            booksMap[book.isbn] = book.title
        }

        if (beforeDate) {
            borrowed = borrowed.reverse()
        }

        return res.status(200).json({
            borrowed: borrowed.map(b => ({
                id: b.id,
                isbn: b.isbn,
                title: booksMap[b.isbn],
                borrowDate: b.borrowDate,
                dueDate: b.dueDate
            }))
        })
    })

export default handler