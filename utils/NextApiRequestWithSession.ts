import type { NextApiRequest } from 'next'

export class Session {
    userId: string

    constructor() {
        this.userId = '' 
    }
}

export interface NextApiRequestWithSession extends NextApiRequest {
    session: Session
}