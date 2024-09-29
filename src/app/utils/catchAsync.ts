import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = (rfn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(rfn(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;
