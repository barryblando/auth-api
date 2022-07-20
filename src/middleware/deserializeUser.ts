import { NextFunction, Request, Response } from 'express'
import { verifyJwt } from '../utils/jwt'

// deserialize current user
const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // remove bearer word in headers authorization 
  const accessToken = (req.headers.authorization || "").replace(/^Bearer\s/, "")

  if (!accessToken) {
    return next()
  }

  const decoded = verifyJwt(accessToken, "accessTokenPublicKey")
  
  if (decoded) {
    // store decoded user in locals
    res.locals.user = decoded
  }

  return next()
}

export default deserializeUser
