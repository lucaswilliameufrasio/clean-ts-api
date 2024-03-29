import { makeApolloServer } from './helpers'
import { MongoHelper } from '@/infra/db'

import { createTestClient } from 'apollo-server-integration-testing'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { ApolloServer, gql } from 'apollo-server-express'

let accountCollection: Collection
let apolloServer: ApolloServer

describe('Login GraphQL', () => {
  beforeAll(async () => {
    apolloServer = await makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Login Query', () => {
    const loginQuery = gql`
        query login ($email: String!, $password: String!) {
            login (email: $email, password: $password) {
                accessToken,
                name
            }
        }
    `

    test('Should return an Account on valid credentials', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Lucas',
        email: 'lucaswilliameufrasio@gmail.com',
        password
      })

      const { query } = createTestClient({ apolloServer })
      const response: any = await query(loginQuery, {
        variables: {
          email: 'lucaswilliameufrasio@gmail.com',
          password: '123'
        }
      })

      expect(response.data.login.accessToken).toBeTruthy()
      expect(response.data.login.name).toBe('Lucas')
    })

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const { query } = createTestClient({ apolloServer })
      const response: any = await query(loginQuery, {
        variables: {
          email: 'lucaswilliameufrasio@gmail.com',
          password: '123'
        }
      })

      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Query', () => {
    const signUpMutation = gql`
        mutation signUp ($name: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
            signUp (name: $name, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
                accessToken,
                name
            }
        }
    `

    test('Should return an Account on valid data', async () => {
      const { mutate } = createTestClient({ apolloServer })
      const response: any = await mutate(signUpMutation, {
        variables: {
          name: 'Lucas',
          email: 'lucaswilliameufrasio@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        }
      })

      expect(response.data.signUp.accessToken).toBeTruthy()
      expect(response.data.signUp.name).toBe('Lucas')
    })

    test('Should return EmailInUseError if email is in use', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Lucas',
        email: 'lucaswilliameufrasio@gmail.com',
        password
      })

      const { mutate } = createTestClient({ apolloServer })
      const response: any = await mutate(signUpMutation, {
        variables: {
          name: 'Lucas',
          email: 'lucaswilliameufrasio@gmail.com',
          password: '123',
          passwordConfirmation: '123'
        }
      })

      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe('The received email is already in use')
    })
  })
})
