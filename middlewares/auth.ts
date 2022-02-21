import type { NextApiResponse } from "next"
import type { NextHandler } from "next-connect"
import jwt from 'jsonwebtoken'

import { NextApiRequestWithSession, Session } from "../utils/NextApiRequestWithSession"

const auth = async (req: NextApiRequestWithSession, res: NextApiResponse, next: NextHandler) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).end()
    }

    try {
        var decoded: any = jwt.verify(token, process.env.JWT_SECRET ?? '')
    }

    catch (error: any) {
        return res.setHeader('Set-Cookie', 'token=deleted; Max-Age=0; path=/').status(401).end()
    }

    req.session = new Session()
    req.session.userId = decoded.userId

    return next();
};

export default auth;