import { apiKeyAuthSchema } from './schemas/'
import {
  badRequest,
  serverError,
  notFound,
  unauthorized,
  forbidden
} from './components/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  serverError,
  notFound,
  unauthorized,
  forbidden
}
