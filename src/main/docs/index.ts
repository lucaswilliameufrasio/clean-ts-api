import { loginPath, surveyPath, signupPath, surveyResultPath } from './paths'
import { badRequest, serverError, notFound, unauthorized, forbidden } from './components'
import { accountSchema, errorSchema, loginParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema, apiKeyAuthSchema, signupParamsSchema, addSurveyParamsSchema, saveSurveyResultParamsSchema, surveyResultSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do curso do Mango para realizar enquetes entre programadores.',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  },{
    name: 'Enquete'
  }],
  paths: {
    '/login': loginPath,
    '/signup': signupPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
    loginParams: loginParamsSchema,
    signUpParams: signupParamsSchema,
    addSurveyParams: addSurveyParamsSchema,
    saveSurveyResultParams: saveSurveyResultParamsSchema,
    error: errorSchema,
    account: accountSchema,
    surveys: surveysSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveyResult: surveyResultSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    serverError,
    notFound,
    unauthorized,
    forbidden
  }
}
