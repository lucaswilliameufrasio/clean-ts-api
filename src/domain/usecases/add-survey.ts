import { SurveyAnswerModel } from '@/domain/models/survey'

export interface AddSurveyModel {
  question: string
  answers: SurveyAnswerModel[]
  date
}

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
