import type { NextApiResponse } from 'next'
import nc from 'next-connect'

import type { NextApiRequestWithSession } from '../../../../utils/NextApiRequestWithSession'
import authMiddleware from '../../../../middlewares/auth'

let db: any = require('../../../../db/models')

const handler = nc<NextApiRequestWithSession, NextApiResponse>()
    .use(authMiddleware) 
    .get(async (req, res) => {
        const userId = req.session.userId 
        const { isbn } = req.query;

        const userBook = await db.userBook.findOne({
            where: {
                isbn, 
                userId 
            }
        })

        if (!userBook) {
            return res.status(404).end()
        }

        const book = await db.book.findOne({
            where: {
                isbn
            }
        })

        const authors: any[] = await book.getAuthors()

        return res.status(200).json({
            isbn: book.isbn,
            title: book.title,
            count: userBook.nCount,
            authors: authors.map(a => ({ name: a.name }))
        })
    })

export default handler