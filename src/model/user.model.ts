import { randomBytes } from 'crypto'
import { getModelForClass, modelOptions, prop, pre, Severity, DocumentType, index } from '@typegoose/typegoose'
import { nanoid } from 'nanoid'
import argon2 from 'argon2'
import log from '../utils/logger'

export const privateFields = [
  "password",
  "__v",
  "verificationCode",
  "passwordResetCode",
  "verified",
  "salt"
]

@pre<User>("save", async function() {
  // if password not being modified return
  if (!this.isModified('password')) return

  const salt = randomBytes(16)
  const hash = await argon2.hash(this.password, { salt, hashLength: 64 })

  this.password = hash
  this.salt = salt

  return
})
@index({ email: 1 }) // adding index for finding by email in forgot password a little bit quicker
@modelOptions({
  schemaOptions: {
    timestamps: true
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
export class User {
  @prop({ lowercase: true, require: true, unique: true })
  email: string

  @prop({ required: true })
  firstName: string

  @prop({ required: true })
  lastName: string
  
  @prop({ require: true })
  password: string

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string

  @prop()
  passwordResetCode: string | null

  @prop({ default: false })
  verified: boolean

  @prop()
  salt: Buffer
  
  // candidate password supplied by the user
  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword, { salt: this.salt, hashLength: 64 })
    } catch(e) {
      log.error(e, "Could not validated password")
      return false
    }
  }
}

const UserModel = getModelForClass(User)

export default UserModel
