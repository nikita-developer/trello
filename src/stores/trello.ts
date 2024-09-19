import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTrelloStore = defineStore('trello', () => {

  const getStages = () => new Promise(resolve => setTimeout(() => resolve(stages), 2000))
  const getCards = () => new Promise(resolve => setTimeout(() => resolve(cards), 2000))
  const getProjects = () => new Promise(resolve => setTimeout(() => resolve(projects), 2000))
  const saveTrello = (data_trello: any) => new Promise(resolve => setTimeout(() => resolve(data_trello), 2000))

  const stages = ref([
    {
      id: 1,
      sort: 10,
      name: "Стадия 1",
      code: "stage-1"
    },
    {
      id: 2,
      sort: 20,
      name: "Стадия 2",
      code: "stage-2"
    },
    {
      id: 3,
      sort: 30,
      name: "Стадия 3",
      code: "stage-3"
    },
    {
      id: 4,
      sort: 40,
      name: "Стадия 4",
      code: "stage-4"
    }
  ])

  const cards = ref([
    {
      id: 1,
      title: "Карточка 1",
      stage: "stage-1",
      project: false,
      score: 3.2
    },
    {
      id: 2,
      title: "Карточка 2",
      stage: "stage-1",
      project: "project-1",
      score: 2
    },
    {
      id: 3,
      title: "Карточка 3",
      stage: "stage-1",
      project: "project-2",
      score: 5
    },
    {
      id: 4,
      title: "Карточка 4",
      stage: "stage-1",
      project: "project-1",
      score: 3
    },
    {
      id: 5,
      title: "Карточка 5",
      stage: "stage-2",
      project: "project-1",
      score: 5
    },
    {
      id: 6,
      title: "Карточка 6",
      stage: "stage-3",
      project: "project-2",
      score: 2
    },
    {
      id: 7,
      title: "Карточка 7",
      stage: "stage-3",
      project: "project-1",
      score: 4
    },
    {
      id: 8,
      title: "Карточка 8",
      stage: "stage-3",
      project: false,
      score: 1
    }
  ])

  const projects = ref([
    {
      id: 1,
      code: "project-1",
      name: "Проект 1",
      sort: 10
    },
    {
      id: 2,
      code: "project-2",
      name: "Проект 2",
      sort: 20
    },
    {
      id: 3,
      code: "project-3",
      name: "Проект 3",
      sort: 30
    },
    {
      id: 4,
      code: "project-4",
      name: "Проект 4",
      sort: 40
    }
  ])

  return {
    getStages,
    getCards,
    getProjects,
    saveTrello,
  }
})
