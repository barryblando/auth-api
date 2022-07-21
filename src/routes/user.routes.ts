import express from 'express'
import validateResource from '../middleware/validateResource'
import { createUserHandler, forgotPasswordHandler, getCurrentUserHandler, getAllUsersHandler, resetPasswordHandler, verifyUserHandler } from '../controller/user.controller'
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from '../schema/user.schema'
import requireUser from '../middleware/requireUser'
import { restrictTo } from '../middleware/restrictTo'

const router = express.Router()

router.post(
  "/api/users",
  validateResource(createUserSchema),
  createUserHandler
)

router.post(
  "/api/users/verify/:id/:verificationCode",
  validateResource(verifyUserSchema),
  verifyUserHandler
)

router.post(
  "/api/users/forgot-password",
  validateResource(forgotPasswordSchema),
  forgotPasswordHandler
)

router.post(
  "/api/users/reset-password/:id/:passwordResetCode",
  validateResource(resetPasswordSchema),
  resetPasswordHandler
)

router.get('/api/users/me', requireUser, getCurrentUserHandler)

router.get(
  '/api/users',
  [
    requireUser,
    restrictTo('admin')
  ],
  getAllUsersHandler
)

export default router
