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

export function findUsers(page: any, limit: any) {
  const currentPage = parseInt(page)
  const perPage = parseInt(limit)
  
  return UserModel.find()
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
}
