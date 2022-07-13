import UserModel, { User } from '../model/user.model'

export function createUser(input: Partial<User>) {
  return UserModel.create(input)
}

export function findByUserId(id: string) {
  return UserModel.findById(id)
}

export function findUserByEmail(email: string) {
  return UserModel.findOne({ email })
}
