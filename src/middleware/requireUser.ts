import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/appError'

const requireUser = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user

  if (!user) {
    return next(new AppError("Invalid token or session has expired", 403))
  }

  return next()
}

export default requireUser
