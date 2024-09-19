import type TrelloProject from '@/types/trello-projects'

export default interface TrelloCard {
  id?: number
  title?: string
  stage?: string
  project?: boolean | string
  full_project?: boolean | string | TrelloProject
  score?: number
}
