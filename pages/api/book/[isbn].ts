import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

let db: any = require('../../../db/models')

const handler = nc<NextApiRequest, NextApiResponse>()
    .get(async (req, res) => {
        const { isbn } = req.query;

        const book = await db.book.findOne({ isbn }, {
            include: [ db.author ]
        })

        if (!book) {
            return res.status(404).end()
        }

        return res.status(200).json({
            isbn: book.isbn,
            title: book.title,
            authors: book.authors
        })
    })

export default handler