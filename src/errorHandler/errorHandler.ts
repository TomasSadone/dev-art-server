import { NextFunction, Request, Response } from 'express';
import MessageResponse from '../types/MessageResponse';

function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log('ERROR', err);
    const message = err['message'] || 'Internal server error';
    const status = err['statusCode'] || 500;
    res.status(status).json(new MessageResponse(message));
}

export default errorHandler;
