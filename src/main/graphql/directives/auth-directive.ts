import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { ForbiddenError } from 'apollo-server-express'
import { makeAuthMiddleware } from '@/main/factories'

export function authDirective (): {
  authDirectiveTypeDefs: string
  authDirectiveTransformer: (schema: GraphQLSchema) => GraphQLSchema
} {
  const directiveName = 'auth'
  const typeDirectiveArgumentMaps: Record<string, any> = {}
  return {
    authDirectiveTypeDefs: `directive @${directiveName} on FIELD_DEFINITION`,
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const authDirective =
            getDirective(schema, fieldConfig, directiveName)?.[0] ?? typeDirectiveArgumentMaps[typeName]

          if (authDirective) {
            const { resolve = defaultFieldResolver } = fieldConfig

            fieldConfig.resolve = async function (source, args, context, info) {
              const request = {
                accessToken: context?.req.headers?.['x-access-token']
              }

              const httpResponse = await makeAuthMiddleware().handle(request)

              if (httpResponse.statusCode === 200) {
                Object.assign(context?.req, httpResponse.body)
                return resolve(source, args, context, info)
              } else {
                throw new ForbiddenError(httpResponse.body.message)
              }
            }

            return fieldConfig
          }
        }
      })
  }
}
