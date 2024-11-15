import { NextApiRequest, NextApiResponse } from 'next';
import verifyToken from '../../middlewares/tokenVerify';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    if (method === 'GET') {
        const token = req.headers.authorization as string;

        if (!token) {
            res.status(401).json({ data: [], msg: 'Token not provided!', err: null });
        }

        const isVerified = verifyToken({ token });
        if (isVerified.err) {
            return res.status(401).json({ data: [], msg: 'Unauthorized', err: true });
        }

        return res.status(200).json({ data: [], msg: 'Token Verified', err: false });
    }
}
