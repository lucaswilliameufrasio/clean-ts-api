export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date
}

export type SurveyAnswerModel = {
  image?: string
  answer: string
}
