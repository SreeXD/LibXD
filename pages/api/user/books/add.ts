import type { NextApiResponse } from 'next'
import nc from 'next-connect'

import type { NextApiRequestWithSession } from '../../../../utils/NextApiRequestWithSession'
import authMiddleware from '../../../../middlewares/auth'
import * as booksApi from '../../../../api/books'
const db: any = require('../../../../db/models')

const handler = nc<NextApiRequestWithSession, NextApiResponse>()
    .use(authMiddleware)
    .post(async (req, res) => {
        let { isbn, nCount } = req.body;
        nCount = +nCount

        if (!isbn || !nCount) {
            return res.status(400).end()
        }

        if (nCount < 0) {
            return res.status(400).end()
        }

        const transaction = await db.sequelize.transaction()

        try {
            let book = await db.book.findOne({
                where: {
                    isbn
                }
            })

            if (!book) {
                const bookInfo = await booksApi.fetchAndProcessInfo(isbn)

                if (!bookInfo.status) {
                    return res.status(404).json({ message: `could not find any books with isbn ${isbn}` })
                }

                book = await db.book.create({
                    isbn,
                    title: bookInfo.title,
                    authors: bookInfo.authors.map(a => ({ name: a }))
                }, {
                    include: [ db.author ],
                    transaction
                });
            }

            const userBook = await db.userBook.findOne({
                where: {
                    userId: req.session.userId,
                    isbn
                }
            })

            if (userBook) {
                await userBook.increment('nCount', { 
                    by: nCount,
                    transaction
                })
            }

            else {
                const user = await db.user.findOne({
                    where: {
                        userId: req.session.userId
                    } 
                })

                await user.addBook(book, {
                    through: {
                        nCount
                    },

                    transaction
                })
            }

            await transaction.commit() 

            return res.status(200).json({ isbn, title: book.title })
        }

        catch (error: any) {
            await transaction.rollback()

            return res.status(500).end()
        }
    })

export default handler