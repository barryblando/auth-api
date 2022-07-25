import express, { NextFunction, Request, Response } from 'express'
import user from './user.routes'
import auth from './auth.routes'

const router = express.Router()

/**
 * @openapi
 * /api/healthcheck:
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get(
  '/api/healthcheck',
  (req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({
      status: 'SUCCESS',
      message: 'Ok',
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    })
  }
)

router.use(user)
router.use(auth)

export default router
