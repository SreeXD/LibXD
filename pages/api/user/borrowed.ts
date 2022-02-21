import type { NextApiResponse } from 'next'
import nc from 'next-connect'
import sequelize, { Op } from 'sequelize'

import type { NextApiRequestWithSession } from '../../../utils/NextApiRequestWithSession'
import authMiddleware from '../../../middlewares/auth'
let db: any = require('../../../db/models')

const handler = nc<NextApiRequestWithSession, NextApiResponse>()
    .use(authMiddleware)    
    .get(async (req, res) => {
        const userId = req.session.userId
        let { afterDate, afterId, beforeDate, beforeId, limit, search } = req.query 

        afterId = afterId ?? 0
        beforeId = beforeId ?? 0
        limit = limit ?? 50

        if (afterDate && beforeDate) {
            return res.status(400).end()
        }

        if (limit && isNaN(+limit)) {
            return res.status(400).end()
        }

        let where = `userId = '${userId}' ${search ? `AND (admNo like '${search}%' OR isbn like '${search}%')` : ''}`

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

        const borrowed: any[] = await db.borrow.findAll(query)

        const isbns = borrowed.map(b => b.isbn).reduce((x, y) => x.concat(y), [])
        const admNos = borrowed.map(b => b.admNo).reduce((x, y) => x.concat(y), [])

        const books: any[] = await db.book.findAll({
            where: {
                [Op.or]: {
                    isbn: isbns
                }
            }
        })

        const students: any[] = await db.student.findAll({
            where: {
                userId,
                
                [Op.or]: {
                    admNo: admNos
                }
            }
        })

        const booksMap: { [isbn: string]: string } = {}
        const studentsMap: { [admNo: number]: string } = {}

        for (const book of books) {
            booksMap[book.isbn] = book.title
        }

        for (const student of students) {
            studentsMap[student.admNo] = student.name
        }

        let ret: any[] = []

        for (const borrow of borrowed) {
            ret.push({
                id: borrow.id,
                admNo: borrow.admNo,
                name: studentsMap[borrow.admNo],
                isbn: borrow.isbn,
                title: booksMap[borrow.isbn],
                borrowDate: borrow.borrowDate,
                dueDate: borrow.dueDate
            })
        }

        if (beforeDate) {
            ret = ret.reverse()
        }

        return res.status(200).json({
            borrowed: ret
        })
    })

export default handler