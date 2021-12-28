import { schema } from '@/main/graphql'
import { ApolloServer } from 'apollo-server-express'
import path from 'path'
import { Express } from 'express'
import { GraphQLError } from 'graphql'

const handleErrors = async (response: any, errors: readonly GraphQLError[]): Promise<void> => {
  errors?.forEach(error => {
    response.data = undefined
    if (checkError(error, 'UserInputError')) {
      response.http.status = 400
    } else if (checkError(error, 'AuthenticationError')) {
      response.http.status = 401
    } else if (checkError(error, 'ForbiddenError')) {
      response.http.status = 403
    } else {
      response.http.status = 500
    }
  })
}

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].some(name => name === errorName)
}

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
    plugins: [{
      requestDidStart: async () => ({
        willSendResponse: async ({ response, errors }) => await handleErrors(response, errors)
      })
    }]
  })
  try {
    await server.start()
    server.applyMiddleware({ app })
  } catch (error) {
    const currentFileName = path.basename(__filename)
    console.error(`${currentFileName}: ${JSON.stringify(error)}`)
  }
}
