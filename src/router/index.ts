import { createRouter, createWebHistory } from 'vue-router'
// @ts-ignore
import Trello from '../views/Trello/Trello.vue'
// @ts-ignore
import TrelloCreateCard from '../views/TrelloCreateCard/TrelloCreateCard.vue'
``
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => Trello
    },
    {
      path: '/create-card',
      name: 'create-card',
      component: () => TrelloCreateCard
    }
  ]
})

export default router
