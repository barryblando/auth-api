import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { User } from './user.model'

export class Session {
  @prop({ ref: () => User })
  userId: Ref<User>

  @prop({ default: true })
  valid: boolean

  @prop()
  userAgent: string

  @prop()
  ip: string
}

const SessionModel = getModelForClass(Session, {
  // a different way of adding model option in typegoose
  schemaOptions: {
    timestamps: true,
  },
})

export default SessionModel
