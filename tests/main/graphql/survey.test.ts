import { makeApolloServer } from './helpers'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'

import { createTestClient } from 'apollo-server-integration-testing'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import { ApolloServer, gql } from 'apollo-server-express'

let surveyCollection: Collection
let accountCollection: Collection
let apolloServer: ApolloServer

const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'Lucas',
    email: 'lucaseufrasio@gmail.com',
    password: '123'
  })
  const id = result.ops[0]._id

  const accessToken = sign({ id }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}

describe('Survey GraphQL', () => {
  beforeAll(async () => {
    apolloServer = makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Surveys Query', () => {
    const surveysQuery = gql`
        query surveys {
            surveys {
              id,
              question,
              answers {
                image,
                answer
              },
              didAnswer,
              date
            }
        }
    `

    test('Should return Surveys', async () => {
      const accessToken = await makeAccessToken()
      const now = new Date()
      await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: now
      })

      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })

      const response: any = await query(surveysQuery)

      expect(response.data.surveys.length).toBe(1)
      expect(response.data.surveys[0].id).toBeTruthy()
      expect(response.data.surveys[0].question).toBe('Question')
      expect(response.data.surveys[0].date).toBe(now.toISOString())
      expect(response.data.surveys[0].didAnswer).toBe(false)
      expect(response.data.surveys[0].answers).toEqual([
        {
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2',
          image: null
        }
      ])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const now = new Date()
      await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: now
      })

      const { query } = createTestClient({ apolloServer })

      const response: any = await query(surveysQuery)

      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe('Access denied')
    })
  })
})
