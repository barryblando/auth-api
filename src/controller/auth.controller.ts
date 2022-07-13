import { Request, Response } from 'express'
import { get } from 'lodash'
import { createSessionInput } from '../schema/auth.schema'
import { findSessionById, signAccessToken, signRefreshToken } from '../service/auth.service'
import { findByUserId, findUserByEmail } from '../service/user.service'
import { verifyJwt } from '../utils/jwt'

export async function createSessionHandler(
  req: Request<{}, {}, createSessionInput>,
  res: Response
) {
  const message = "Invalid email or password"
  const { email, password } = req.body

  const user = await findUserByEmail(email)
  
  if (!user) {
    return res.send(message)
  }

  if (!user.verified) {
    return res.send("Please verify your email")
  }
  
  const isValid = await user.validatePassword(password)

  if (!isValid) {
    return res.send(message)
  }
  
  // sign a access token
  const accessToken = signAccessToken(user)

  // sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user._id })

  // send the tokens
  return res.send({
    accessToken,
    refreshToken
  })
}

export async function refreshAccessTokenHandler(
  req: Request,
  res: Response
) {
  const refreshToken = get(req, 'headers.x-refresh')

  const decoded = verifyJwt<{ sessionId: string }>(refreshToken, "refreshTokenPublicKey")

  if (!decoded) {
    return res.status(401).send("Could not refresh access token")
  }

  const session = await findSessionById(decoded.sessionId)

  if (!session || !session.valid) {
    return res.status(401).send("Could not refresh acesss token")
  }

  const user = await findByUserId(String(session.user))

  if (!user) {
    return res.send(401).send("Could not refresh access token")
  }

  const accessToken = signAccessToken(user)

  return res.send({ accessToken })
}

export async function deleteSessionHandler(
  req: Request,
  res: Response
) {
  const refreshToken = get(req, 'headers.x-session')

  const decoded = verifyJwt<{ sessionId: string }>(refreshToken, "refreshTokenPublicKey")

  if (!decoded) {
    return res.status(401).send("Session Not Found")
  }

  const session = await findSessionById(decoded.sessionId)

  if (!session || !session.valid) {
    return res.status(401).send("Session Invalid")
  }

  session.valid = false
  
  await session.save()
  
  return res.send({ accessToken: '', refreshToken: '' })
}
