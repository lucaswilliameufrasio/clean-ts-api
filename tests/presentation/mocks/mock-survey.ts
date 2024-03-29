import { mockSurveyModels } from '@/tests/domain/mocks'
import { AddSurvey, CheckSurveyById, LoadAnswersBySurvey, LoadSurveys } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models/survey'
import { faker } from '@faker-js/faker'
export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params

  async add (data: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = data
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  result = mockSurveyModels()
  accountId: string

  async load (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId
    return this.result
  }
}

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  result = [
    faker.random.word(),
    faker.random.word()
  ]

  id: string

  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
    this.id = id
    return this.result
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  result = true
  id: string

  async checkById (id: string): Promise<CheckSurveyById.Result> {
    this.id = id
    return this.result
  }
}
