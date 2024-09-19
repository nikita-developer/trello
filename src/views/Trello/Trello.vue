<template>
  <Loader v-if="is_load"></Loader>
  <div class="trello">
    <TrelloHeader @save="save" @project="filterCards" :projects></TrelloHeader>
    <div class="trello__stages">
      <div class="trello-stage" v-for="(stage, stage_index) in filter_cards" :key="stage.id">
        <div class="trello-stage__header">
          <div class="trello-stage__title">{{ stage.name }}</div>
          <div class="trello-stage__arrows" v-if="stage?.cards.length > 1">
            <div class="trello-stage__arrow" @click="sortCards(stage_index)"><img src="@/assets/img/arrow-down.svg" alt="Сортировать по убыванию"></div>
            <div class="trello-stage__arrow" @click="sortCards(stage_index, false)"><img src="@/assets/img/arrow-up.svg" alt="Сортировать по возрастанию"></div>
          </div>
        </div>
        <draggable
          class="trello-stage__body"
          ghost-class="ghost"
          :list="stage.cards"
          group="people"
          itemKey="id"
          @add="moveAndAdd"
        >
          <template #item="{ element, index }">
            <div class="trello-card">
              <div class="trello-card__header">
                <div class="trello-card__name">{{ element.title }}</div>
                <div class="trello-card__icons">
                  <div class="trello-card__icon" @click="isVisibleUpdate( true, element)"><img src="@/assets/img/copy.svg" alt="Обновить"></div>
                  <div class="trello-card__icon" @click="removeAt(stage_index, index)"><img src="@/assets/img/delete.svg" alt="Удалить"></div>
                  <div class="trello-card__icon trello-card__icon--menu"><img src="@/assets/img/menu.svg" alt="Меню"></div>
                </div>
              </div>
              <div class="trello-card__body">
                <p class="trello-card__description">Балл: <strong>{{ element.score }}</strong></p>
              </div>
              <div class="trello-card__chips" v-if="element.project">
                <button class="trello-card__chip">{{ element.full_project?.name }}</button>
              </div>
            </div>
          </template>
          <template v-if="!stage.cards.length" #footer>
            <div class="trello-card-empty">Список пуст</div>
          </template>
        </draggable>
        <div class="trello-stage__footer">
          <button class="trello-stage__button" @click="isVisibleCreate(true, stage)">Добавить</button>
        </div>
      </div>
    </div>
    <TrelloCreateCard v-if="is_visible_create" @create="create" :projects :stage="stage" @close="isVisibleCreate"></TrelloCreateCard>
    <TrelloUpdateCard v-if="is_visible_update" @update="update" :card :projects :stages @close="isVisibleUpdate"></TrelloUpdateCard>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, shallowRef } from 'vue'
import draggable from 'vuedraggable'
import { useTrelloStore } from '@/stores/trello'
import type TrelloStage from '@/types/trello-stage'
import type TrelloCard from '@/types/trello-card'
import type TrelloProject from '@/types/trello-projects'
import TrelloHeader from '@/components/TrelloHeader/TrelloHeader.vue'
import TrelloUpdateCard from '@/components/TrelloModalCards/TrelloUpdateCard/TrelloUpdateCard.vue'
import TrelloCreateCard from '@/components/TrelloModalCards/TrelloCreateCard/TrelloCreateCard.vue'
import Loader from '@/components/Loader/Loader.vue'

const store = useTrelloStore()

const is_visible_create = shallowRef<boolean>(false)
const is_visible_update = shallowRef<boolean>(false)
const stages = ref<TrelloStage[]>([])
const cards = ref<TrelloCard[]>([])
const projects = ref<TrelloProject[]>([])
const combines_cards_stages = ref()
const filter_cards = ref()
const stage = ref<TrelloStage>()
const card = ref<TrelloCard>()
const is_load = shallowRef<boolean>(false)

const isVisibleCreate = (flag: boolean = false, modal_stage = {}) => {
  flag ? is_visible_create.value = true : is_visible_create.value = false
  stage.value = modal_stage
}

const isVisibleUpdate = (flag: boolean = false, modal_card = {}) => {
  flag ? is_visible_update.value = true : is_visible_update.value = false
  card.value = modal_card
}

const getStages = async () => {
  if (!!localStorage.getItem('trello_stages')) stages.value = JSON.parse(localStorage.getItem('trello_stages'))
  try {
    const res = await store.getStages()
    stages.value = await res.value
    localStorage.setItem('trello_stages', JSON.stringify(stages.value))
  } catch (e) {
    console.log(e)
  }
}

const getCards = async () => {
  if (!!localStorage.getItem('trello_cards')) cards.value = JSON.parse(localStorage.getItem('trello_cards'))
  try {
    const res = await store.getCards()
    cards.value = await res.value
    localStorage.setItem('trello_cards', JSON.stringify(cards.value))
  } catch (e) {
    console.log(e)
  }
}

const getProjects = async () => {
  try {
    if (!!localStorage.getItem('trello_projects')) projects.value = JSON.parse(localStorage.getItem('trello_projects'))
    const res = await store.getProjects()
    projects.value = await res.value
    localStorage.setItem('trello_projects', JSON.stringify(projects.value))
  } catch (e) {
    console.log(e)
  }
}

const save = async () => {
  is_load.value = true
  try {
    const res = await store.saveTrello(combines_cards_stages.value)
    is_load.value = false
    console.log(res)
  } catch (e) {
    console.log(e)
  }
}

const getDataTrello = async () => {
  if (!!localStorage.getItem('trello_data')) {
    combines_cards_stages.value = JSON.parse(localStorage.getItem('trello_data'))
    filterCards()
  }

  if (!!!localStorage.getItem('trello_data')) {
    is_load.value = true
    try {
      await Promise.all([store.getStages(), store.getCards(), store.getProjects()])
      combinesCardsProjects()
      combinesCardsStages()
      localStorage.setItem('trello_data', JSON.stringify(combines_cards_stages.value))
      filterCards()
      is_load.value = false
    } catch (e) {
      console.log(e)
    }
  }
}

// создание карточки
const create = (card, stage_id) => {
  filter_cards.value.find(stage => {
    if(stage.id === stage_id) stage.cards.push(card)
  })
  cloneData()
  isVisibleCreate()
}

const update = (card) => {
  filter_cards.value.find(((stage, stage_idx) => {
    stage.cards.find((el_card, card_idx) => {
      if(el_card.id === card.id) {
        if(stage.code === card.stage) return filter_cards.value[stage_idx].cards[card_idx] = card
        filter_cards.value[stage_idx].cards.splice(card_idx, 1)
        filter_cards.value.find((el, idx) => {
          if(el.code === card.stage) filter_cards.value[idx].cards.push(card)
        })
      }
    })
  }))
  cloneData()
  isVisibleUpdate()
}

const cloneData = () => {
  combines_cards_stages.value = JSON.parse(JSON.stringify(filter_cards.value))
  localStorage.setItem('trello_data', JSON.stringify(combines_cards_stages.value))
}

// добавляем проекты в карточки
const combinesCardsProjects = () => cards.value = cards.value.filter((card: TrelloCard) => projects.value.map((project: TrelloProject) => {
  if(card.project === project.code) return card.full_project = project
}))

// группируем карточки и стадии
const combinesCardsStages = () => combines_cards_stages.value = stages.value.filter((stage: TrelloStage) => stage.cards = cards.value.filter((card: TrelloCard) => card.stage === stage.code))

const sortCards = (stage_index: string | number, dec_inc: boolean = true) => {
  filter_cards.value[stage_index].cards?.sort((a, b) => (dec_inc ? a.score > b.score : a.score < b.score) ? 1 : -1)
  cloneData()
}

// фильтруем карточки по проектам
const filterCards = (project: TrelloProject | null = null) => {
  if (!!localStorage.getItem('trello_filter') && localStorage.getItem('trello_filter') !== 'undefined' && localStorage.getItem('trello_filter') !== 'null') {
    project = JSON.parse(localStorage.getItem('trello_filter'))
  }

  filter_cards.value = combines_cards_stages.value.map(stage => {
    if(!project) return JSON.parse(JSON.stringify(stage))
    const new_obj = JSON.parse(JSON.stringify(stage))
    new_obj.cards = stage.cards.filter(card => card.project === project?.code)
    return new_obj
  })
}

// перемещаем или добавляем карточки
const moveAndAdd = () => {
  filter_cards.value.map(stage => stage.cards = stage.cards.map(card => ({...card, stage: stage.code })))
  cloneData()
}

// удаляем карточки
const removeAt = (stage_index, card_index) => {
  filter_cards.value[stage_index].cards.splice(card_index, 1)
  cloneData()
}

onBeforeMount(() => {
  getStages()
  getCards()
  getProjects()
  getDataTrello()
})
</script>

<style scoped>
  @import "trello.scss";
</style>
