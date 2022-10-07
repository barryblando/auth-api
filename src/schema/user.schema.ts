import { object, string, TypeOf } from 'zod'

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - name
 *        - password
 *        - passwordConfirmation
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        name:
 *          type: string
 *          default: Jane Doe
 *        password:
 *          type: string
 *          default: stringPassword123
 *        passwordConfirmation:
 *          type: string
 *          default: stringPassword123
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        name:
 *          type: string
 *        id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */
export const createUserSchema = object({
  body: object({
    firstName: string({ required_error: "First name is required" }),
    lastName: string({ required_error: "Last name is required" }),
    password: string({required_error: "Password is required" })
      .min(6, "Password is too short - should be min 6 chars")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirmation: string({ required_error: "Password confirmation is required" }),
    email: string({ required_error: "Email is required" })
      .email("Not a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not match",
    path: ['passwordConfirmation']
  }),
})

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string()
  })
})

export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: "Email is required" })
      .email("Not a valid email")
  })
})

export const resetPasswordSchema = object({
  params: object({
    id: string(),
    passwordResetCode: string(),
  }),
  body: object({
    password: string({ required_error: "Password is required" })
      .min(6, "Password is too short - should be min 6 chars")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirmation: string({ required_error: "Password confirmation is required" }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not match",
    path: ['passwordConfirmation']
  }),
})

export const getUsersSchema = object({
  query: object({
    page: string().optional().default("1"),
    limit: string().optional().default("5")
  })
})

// TypeOf function from Zod to infer the TypeScript types of schemas to be use in validateResource
export type CreateUserInput = TypeOf<typeof createUserSchema>["body"]

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"]

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"]

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>

export type GetUsersInput = TypeOf<typeof getUsersSchema>["query"]
