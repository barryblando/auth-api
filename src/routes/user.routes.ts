import express from 'express'
import validateResource from '../middleware/validateResource'
import { createUserHandler, forgotPasswordHandler, getCurrentUserHandler, getAllUsersHandler, resetPasswordHandler, verifyUserHandler } from '../controller/user.controller'
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, getUsersSchema, verifyUserSchema } from '../schema/user.schema'
import requireUser from '../middleware/requireUser'
import { restrictTo } from '../middleware/restrictTo'

const router = express.Router()

/**
 * @openapi
 * /api/users:
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
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
  validateResource(getUsersSchema),
  [
    requireUser,
    restrictTo('admin')
  ],
  getAllUsersHandler
)

export default router
