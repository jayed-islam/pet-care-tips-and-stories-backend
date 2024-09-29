import { Request, Response, NextFunction } from 'express';

const convertDateStrings = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body.postedDate) {
    req.body.postedDate = new Date(req.body.postedDate);
  }
  next();
};

export default convertDateStrings;
