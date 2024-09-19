import type TrelloCard from '@/types/trello-card'

export default interface TrelloStage {
  id?: number
  sort?: number
  name?: string
  code?: string
  cards?: TrelloCard[]
}
