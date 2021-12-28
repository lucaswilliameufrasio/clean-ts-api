import { makeExecutableSchema } from '@graphql-tools/schema'

import { authDirective } from '@/main/graphql/directives'
import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'

const { authDirectiveTransformer, authDirectiveTypeDefs } = authDirective()

const executableSchema = makeExecutableSchema({
  resolvers,
  typeDefs: [authDirectiveTypeDefs, ...typeDefs]
})

export const schema = authDirectiveTransformer(executableSchema)
