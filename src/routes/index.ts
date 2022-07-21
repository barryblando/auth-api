import express, { NextFunction, Request, Response } from 'express'
import user from './user.routes'
import auth from './auth.routes'

const router = express.Router()

// Testing
router.get(
  '/api/healthcheck',
  (req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({
      status: 'success',
      message: 'Ok',
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    })
  }
)

router.use(user)
router.use(auth)

export default router
