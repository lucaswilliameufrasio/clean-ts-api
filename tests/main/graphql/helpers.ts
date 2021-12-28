import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'
import { authDirective } from '@/main/graphql/directives'
import { ApolloServer } from 'apollo-server-express'
import { makeExecutableSchema } from '@graphql-tools/schema'

export const makeApolloServer = async (): Promise<ApolloServer> => {
  const { authDirectiveTransformer, authDirectiveTypeDefs } = authDirective()

  const schema = makeExecutableSchema({
    resolvers,
    typeDefs: [authDirectiveTypeDefs, ...typeDefs]
  })

  const server = new ApolloServer({
    schema: authDirectiveTransformer(schema),
    context: ({ req }) => ({ req })
  })

  await server.start()

  return server
}
