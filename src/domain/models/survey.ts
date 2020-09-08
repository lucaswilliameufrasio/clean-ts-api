export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date
}

export interface SurveyAnswerModel {
  image?: string
  answer: string
}
