import { randomBytes } from 'crypto'
import { getModelForClass, modelOptions, prop, pre, Severity, DocumentType, index } from '@typegoose/typegoose'
import { nanoid } from 'nanoid'
import argon2 from 'argon2'
import log from '../utils/logger'

@pre<User>("save", async function() {
  // if password not being modified return
  if (!this.isModified('password')) return

  const salt = randomBytes(16)
  const hash = await argon2.hash(this.password, { salt, hashLength: 64 })

  this.password = hash
  this.salt = salt

  return
})
@index({ email: 1 }) // indexing email a little bit quicker in findByEmail
@modelOptions({
  schemaOptions: {
    timestamps: true,
    // optimisticConcurrency: true // use for microservices
    // versionKey: 'version' // use for microservices
    toJSON: {
      transform(doc, ret) {
        // I assign _id to id, for it to work with other micro services' Database
        ret.id = ret._id
        delete ret._id // remove _id after converting it
        // Private Fields to remove when doing JSON, not useful in micro services I'm integrating 
        delete ret.__v
        delete ret.password
        // for verification & reset test purposes won't delete unless are in production
        process.env.NODE_ENV === "production" && delete ret.verificationCode
        process.env.NODE_ENV === "production" && delete ret.passwordResetCode
        delete ret.verified
        delete ret.salt
      }
    }
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

  @prop({ default: 'user' })
  role: string

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string

  @prop()
  passwordResetCode: string | null

  @prop({ default: false })
  verified: boolean

  @prop()
  salt: Buffer

  @prop({ default: () => Date.now()})
  createdAt: Date

  @prop({ default: () => Date.now()})
  updatedAt: Date  
  
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
