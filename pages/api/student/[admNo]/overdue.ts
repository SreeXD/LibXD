import type { NextApiResponse } from 'next'
import nc from 'next-connect'
import { Op } from 'sequelize'

import type { NextApiRequestWithSession } from '../../../../utils/NextApiRequestWithSession'
import authMiddleware from '../../../../middlewares/auth'
import { convertUTCDateToLocalDate } from '../../../../utils/utils'
let db: any = require('../../../../db/models')

const handler = nc<NextApiRequestWithSession, NextApiResponse>()
    .use(authMiddleware)    
    .get(async (req, res) => {
        const userId = req.session.userId
        let { admNo, date }: any = req.query 

        date = convertUTCDateToLocalDate(new Date(date))

        const query: any = {
            where: {
                userId, 
                admNo,
                dueDate: {
                    [Op.lt]: date
                }
            },
            order: [
                [ 'dueDate', 'asc' ],
                [ 'id', 'asc' ]
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

        const overdue: any[] = await db.borrow.findAll(query)

        const isbns = overdue.map(b => b.isbn)

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

        return res.status(200).json({
            overdue: overdue.map(b => ({
                id: b.id,
                isbn: b.isbn,
                title: booksMap[b.isbn],
                borrowDate: b.borrowDate,
                dueDate: b.dueDate
            }))
        })
    })

export default handler