import { NextFunction, Request, Response } from 'express'
import { get } from 'lodash'
import { createSessionInput } from '../schema/auth.schema'
import { findSessionById, signAccessToken, signRefreshToken, sendRefreshToken, clearCookie } from '../service/auth.service'
import { findByUserId, findUserByEmail } from '../service/user.service'
import AppError from '../utils/appError'
import { verifyJwt } from '../utils/jwt'

export async function createSessionHandler(
  req: Request<{}, {}, createSessionInput>,
  res: Response,
  next: NextFunction
) {
  const message = "Invalid email or password"
  const { email, password } = req.body
  const connectionInformation = {
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  }

  const user = await findUserByEmail(email)
  
  if (!user) {
    return next(new AppError(message, 401));
  }

  if (!user.verified) {
    return next(new AppError("Please verify your email", 401));
  }
  
  const isValid = await user.validatePassword(password)

  if (!isValid) {
    return next(new AppError(message, 401));
  }
  
  // sign a access token
  const accessToken = signAccessToken(user)

  // sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user._id, ...connectionInformation })
  
  // set refresh token in cookie (other way of storing refresh token)
  sendRefreshToken(res, refreshToken)

  // send the tokens
  return res.status(201).send({
    accessToken,
    refreshToken
  })
}

export async function refreshAccessTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const message = "Could not refresh access token"
  // const refreshToken = get(req, 'headers.x-refresh')
  const refreshToken = get(req, 'cookies.session') as string
  
  const decoded = verifyJwt<{ sessionId: string }>(refreshToken, "refreshTokenPublicKey")

  if (!decoded) {
    return next(new AppError(message, 401));
  }

  const session = await findSessionById(decoded.sessionId)

  if (!session || !session.valid) {
    return next(new AppError(message, 401));
  }

  const user = await findByUserId(String(session.userId))

  if (!user) {
    return next(new AppError(message, 401));
  }

  const accessToken = signAccessToken(user)

  return res.send({ accessToken })
}

export async function deleteSessionHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const message = "Session not found"
  const refreshToken = get(req, 'cookies.session') as string

  const decoded = verifyJwt<{ sessionId: string }>(refreshToken, "refreshTokenPublicKey")

  if (!decoded) {
    return next(new AppError(message, 401));
  }

  const session = await findSessionById(decoded.sessionId)

  if (!session || !session.valid) {
    return next(new AppError(message, 401));
  }

  session.delete()
  
  clearCookie(res)
  
  return res.send({ accessToken: '', refreshToken: '' })
}
