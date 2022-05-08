import { makeApolloServer } from './helpers'
import env from '@/main/config/env'
import { MongoHelper } from '@/infra/db'

import { createTestClient } from 'apollo-server-integration-testing'
import { ApolloServer, gql } from 'apollo-server-express'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import MockDate from 'mockdate'

let surveyCollection: Collection
let accountCollection: Collection
let apolloServer: ApolloServer

const makeAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'Lucas',
    email: 'lucaseufrasio@gmail.com',
    password: '123'
  })
  const id = result.insertedId

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

describe('SurveyResult GraphQL', () => {
  beforeAll(async () => {
    apolloServer = await makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    MockDate.reset()
    MockDate.set(new Date())

    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('SurveyResult Query', () => {
    const surveyResultQuery = gql`
        query surveyResult ($surveyId: String!) {
          surveyResult(surveyId: $surveyId) {
            surveyId,
            question,
            answers {
              answer,
              count,
              percent,
              isCurrentAccountAnswer
            },
            date
          }
        }
    `

    test('Should return SurveyResult', async () => {
      const accessToken = await makeAccessToken()
      const now = new Date()
      const surveyRes = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: new Date()
      })

      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })

      const response: any = await query(surveyResultQuery, {
        variables: {
          surveyId: surveyRes.insertedId.toHexString()
        }
      })

      expect(response.data.surveyResult.question).toBe('Question')
      expect(response.data.surveyResult.date).toBe(now.toISOString())
      expect(response.data.surveyResult.answers).toEqual([
        {
          answer: 'Answer 1',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }, {
          answer: 'Answer 2',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const surveyRes = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: new Date()
      })

      const { query } = createTestClient({ apolloServer })

      const response: any = await query(surveyResultQuery, {
        variables: {
          surveyId: surveyRes.insertedId.toHexString()
        }
      })
      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe('Access denied')
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    const saveSurveyResultMutation = gql`
        mutation saveSurveyResult ($surveyId: String!, $answer: String!) {
          saveSurveyResult(surveyId: $surveyId, answer: $answer) {
            surveyId,
            question,
            answers {
              answer,
              count,
              percent,
              isCurrentAccountAnswer
            },
            date
          }
        }
    `

    test('Should return SurveyResult', async () => {
      const accessToken = await makeAccessToken()
      const now = new Date()
      const surveyRes = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: now
      })

      const { mutate } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })

      const response: any = await mutate(saveSurveyResultMutation, {
        variables: {
          surveyId: surveyRes.insertedId.toHexString(),
          answer: 'Answer 1'
        }
      })

      expect(response.data.saveSurveyResult.question).toBe('Question')
      expect(response.data.saveSurveyResult.date).toBe(now.toISOString())
      expect(response.data.saveSurveyResult.answers).toEqual([
        {
          answer: 'Answer 1',
          count: 1,
          percent: 100,
          isCurrentAccountAnswer: true
        }, {
          answer: 'Answer 2',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ])
    })

    test('Should return AccessDeniedError if no token is provided', async () => {
      const surveyRes = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com'
        }, {
          answer: 'Answer 2'
        }],
        date: new Date()
      })

      const { mutate } = createTestClient({ apolloServer })

      const response: any = await mutate(saveSurveyResultMutation, {
        variables: {
          surveyId: surveyRes.insertedId.toHexString(),
          answer: 'Answer 1'
        }
      })
      expect(response.data).toBeFalsy()
      expect(response.errors[0].message).toBe('Access denied')
    })
  })
})
