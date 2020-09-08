import { SurveyAnswerModel } from '../models/survey'

export interface AddSurveyModel {
  question: string
  answers: SurveyAnswerModel[]
  date
}

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
