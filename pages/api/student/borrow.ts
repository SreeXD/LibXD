import type { NextApiResponse } from 'next'
import nc from 'next-connect'

import type { NextApiRequestWithSession } from '../../../utils/NextApiRequestWithSession'
import authMiddleware from '../../../middlewares/auth'

const db: any = require('../../../db/models')

const handler = nc<NextApiRequestWithSession, NextApiResponse>()
    .use(authMiddleware)
    .post(async (req, res) => {
        const userId = req.session.userId
        let { admNo, isbn, dueDate, borrowDate } = req.body

        if (!admNo || !isbn || !dueDate) {
            return res.status(400).end()
        }

        borrowDate = new Date(borrowDate)
        dueDate = new Date(dueDate)

        if (isNaN(dueDate.valueOf()) || isNaN(borrowDate.valueOf())) {
            return res.status(400).end()
        }

        if (dueDate <= borrowDate) {
            return res.status(400).end()
        }

        const book = await db.userBook.findOne({
            where: {
                userId,
                isbn
            }
        })

        if (!book || !book.nCount) {
            return res.status(400).json({ message: 'no available copies of the book in user library' })
        }

        const student = await db.student.findOne({
            where: {
                userId,
                admNo
            }
        })

        if (!student) {
            return res.status(400).json({ message: 'no student with the specified admission number' })
        }

        const borrowedAlready = await db.borrow.findOne({
            where: {
                userId, 
                admNo: student.admNo,
                isbn
            }
        })

        if (borrowedAlready) {
            return res.status(400).json({ message: 'student has already borrowed a copy of the same book' })
        }

        const transaction = await db.sequelize.transaction()

        try {
            await book.decrement('nCount', { 
                transaction
            })

            await db.borrow.create({
                userId,
                admNo,
                isbn: book.isbn,
                borrowDate: borrowDate,
                dueDate
            }, {
                transaction
            }) 

            await transaction.commit()

            return res.status(200).end()
        }

        catch (error) {
            await transaction.rollback()

            return res.status(500).end()
        }
    })

export default handler