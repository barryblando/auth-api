import { Response } from 'express'
import { DocumentType } from '@typegoose/typegoose'
import SessionModel, { Session } from '../model/session.model'
import { User } from '../model/user.model'
import { signJwt } from '../utils/jwt'
import { databaseResponseTimeHistogram } from '../utils/metrics'

export async function createSession({ userId, userAgent, ip }: Partial<DocumentType<Session>>) {
  const metricsLabels = {
    operation: 'createSesssion'
  }

  const timer = databaseResponseTimeHistogram.startTimer()
  try {
    const result = await SessionModel.create({ userId, userAgent, ip })
    
    timer({ ...metricsLabels, success: "true" })
    
    return result
  } catch (e) {
    timer({ ...metricsLabels, success: "false" })
    throw e
  }
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id)
}

export async function signRefreshToken({ userId, userAgent, ip }: Partial<DocumentType<Session>>) {
  const session = await createSession({
    userId,
    userAgent,
    ip
  })

  const refreshToken = signJwt(
    { sessionId: session._id },
    "refreshTokenPrivateKey",
    { expiresIn: "7d" }
  )

  return refreshToken
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = user.toJSON()
  
  const accessToken = signJwt(
    payload,
    "accessTokenPrivateKey",
    { expiresIn: "15m" }
  ) 
  
  return accessToken
}

// https://learning.postman.com/docs/sending-requests/cookies/
// res.cookie('jwt', token, {
// 	httpOnly: true, // so it can't be accessed by javascript xss attacks
//	secure: true, //on HTTPS
//	domain: 'example.com', // set your domain, if you want it to work w/ sub domain put '.example.com'
// `sub domain i.e api.example.com, www.example.com` - this is important if you're using using SSR (Next.js/Nuxt.js)
// })

export function sendRefreshToken(res: Response, token: string) {
	res.cookie('session', token, {
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //  match the expiration date use in the refresh token (7days)
		httpOnly: true,
		path: '/api/sessions/',
	})
}

// https://expressjs.com/en/5x/api.html#res.clearCookie
export function clearCookie(res: Response) {
	res.clearCookie('session', {
		path: '/api/sessions/',
	})
}
