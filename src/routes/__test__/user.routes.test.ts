import request from 'supertest'

import { app } from '../../app'

import sendMail from '../../utils/mailer'

// TIP: Test only functionalities/modules that user/business does care about
// These ones down here I'm testing isn't really critical, just showing how to test
// As long as you handle all error possibilites in an auth API, you can skip these kinds of tests

const setup = async () => {
  const response = await request(app)
    .post('/api/users')
    // global variable
    .send({ 
      firstName: 'Gabriela',
      lastName: 'Leskur',
      email: 'test@test.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    })
  
  return { response }
}

it('returns a 201 on successful signup', async () => {
    const { response } = await setup()
    expect(response.status).toBe(201)

  expect(sendMail).toHaveBeenCalled()
})

it('returns a 409 if account already exists', async () => {
  const { response } = await setup()
  expect(response.status).toBe(201)
  
  await request(app)
    .post('/api/users')
    // global variable
    .send({ 
      firstName: 'Gabriela',
      lastName: 'Leskur',
      email: 'test@test.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    })
    .expect(409)
})

it('returns a 201 on successful verification', async () => {
  const { response } = await setup()
  expect(response.status).toBe(201)

   await request(app)
    .post(`/api/users/verify/${response.body.user.id}/${response.body.user.verificationCode}`)
    .send()
    .expect(201)
})
