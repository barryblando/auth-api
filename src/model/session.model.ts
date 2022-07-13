import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { User } from './user.model'

export class Session {
  @prop({ ref: () => User })
  user: Ref<User>

  @prop({ default: true })
  valid: boolean
}

const SessionModel = getModelForClass(Session, {
  // a different way of adding model option in typegoose
  schemaOptions: {
    timestamps: true
  }
})

export default SessionModel
