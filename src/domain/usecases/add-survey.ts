import { SurveyAnswerModel } from '@/domain/models/survey'

export type AddSurveyModel = {
  question: string
  answers: SurveyAnswerModel[]
  date
}

export interface AddSurvey {
  add: (data: AddSurveyModel) => Promise<void>
}
