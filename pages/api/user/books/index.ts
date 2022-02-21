import type { NextApiResponse } from 'next'
import nc from 'next-connect'
import { Op } from 'sequelize'

import type { NextApiRequestWithSession } from '../../../../utils/NextApiRequestWithSession'
import authMiddleware from '../../../../middlewares/auth'
let db: any = require('../../../../db/models')

const handler = nc<NextApiRequestWithSession, NextApiResponse>()
    .use(authMiddleware)    
    .get(async (req, res) => {
        const userId = req.session.userId
        let { after, before, limit, search } = req.query 
        limit = limit ?? 50

        if (after && before) {
            return res.status(400).end()
        }

        const query: any = {
            where: {},
            limit: +limit,
            order: [
                [ 'isbn', 'asc' ]
            ]
        }

        if (search) {
            query.where[Op.or] = {
                isbn: {
                    [Op.like]: `${search}%`
                },
                title: {
                    [Op.like]: `${search}%`
                },
            }
        }
        
        if (after) {
            query.where.isbn = {
                [Op.gt]: after
            }
        }

        if (before) {
            query.where.isbn = {
                [Op.lt]: before
            }

            query.order = [
                [ 'isbn', 'desc' ]
            ]
        }

        const user = await db.user.findOne({
            where: {
                userId
            }
        }) 

        let books: any[] = await user.getBooks(query)

        if (before) {
            books = books.reverse()
        }

        return res.status(200).json({
            books: books.map(book => ({
                isbn: book.isbn,
                title: book.title,
                nCount: book.userBook.nCount
            }))
        })
    })

export default handler