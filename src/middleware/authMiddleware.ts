import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

interface JwtPayload {
    id: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({
            data: null,
            error: 'No token provided'
        });
        return;
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            res.status(401).json({
                data: null,
                error: 'Invalid token'
            });
            return;
        }

        // Type assertion to any to bypass TypeScript error
        (req as any).user = decoded as JwtPayload;
        next();
    });
};



export const adminMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as any).user.id; // authMiddleware ile eklenen kullanıcı ID'si

    try {
        const user = await User.findById(userId);

        if (!user || !user.isAdmin) {
            res.status(403).json({
                data: null,
                error: 'Access denied. Admin privileges required.'
            });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({
            data: null,
            error: 'Internal server error'
        });
    }
};
