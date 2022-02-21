import type { NextApiResponse } from 'next'
import nc from 'next-connect'

import type { NextApiRequestWithSession } from '../../../utils/NextApiRequestWithSession'
import authMiddleware from '../../../middlewares/auth'

const db: any = require('../../../db/models')

const handler = nc<NextApiRequestWithSession, NextApiResponse>()
    .use(authMiddleware)
    .post(async (req, res) => {
        const { admNo, isbn } = req.body
        const userId = req.session.userId

        if (!admNo || !isbn) {
            return res.status(400).end()
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

        const borrowDetails = await db.borrow.findOne({
            where: {
                userId, 
                admNo: student.admNo,
                isbn
            }
        })

        if (!borrowDetails) {
            return res.status(400).json({ message: 'no records of the student having to return this book' })
        }

        const transaction = await db.sequelize.transaction()

        try {
            const book = await db.userBook.findOne({
                where: {
                    userId,
                    isbn
                }
            })

            await db.borrow.destroy({
                where: {
                    userId,
                    admNo,
                    isbn: book.isbn
                } 
            },
            {
                transaction
            })

            await book.increment('nCount', { 
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