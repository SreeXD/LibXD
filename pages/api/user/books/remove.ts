import type { NextApiResponse } from 'next'
import nc from 'next-connect'

import authMiddleware from '../../../../middlewares/auth'
import type { NextApiRequestWithSession } from '../../../../utils/NextApiRequestWithSession'
const db: any = require('../../../../db/models')

const handler = nc<NextApiRequestWithSession, NextApiResponse>()
    .use(authMiddleware)
    .post(async (req, res) => {
        let { isbn, nCount } = req.body
        nCount = +nCount

        if (!isbn || !nCount) {
            return res.status(400).end()
        }

        if (nCount < 0) {
            return res.status(400).end()
        }

        const userId = req.session.userId 

        const book = await db.userBook.findOne({
            where: {
                userId,
                isbn
            }
        })

        if (!book) {
            return res.status(400).json({ message: 'there are no copies of the book in user library' })
        }

        if (nCount > book.nCount) {
            return res.status(400).json({ message: `user library does not have ${nCount} cop${nCount > 1 ? 'ies' : 'y'} of the book` })
        }

        const userBook = await book.decrement('nCount', {
            by: nCount
        })

        return res.status(200).end()
    })

export default handler