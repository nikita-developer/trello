<script setup lang="ts">
import { onBeforeMount, ref, shallowRef, toRaw } from 'vue'
import type TrelloCard from '@/types/trello-card'
import type TrelloProject from '@/types/trello-projects'
import { useTrelloStore } from '@/stores/trello'
import type TrelloStage from '@/types/trello-stage'
import router from '@/router'
import Loader from '@/components/Loader/Loader.vue'

const store = useTrelloStore()
const card = ref<TrelloCard>({})
const stages = ref<TrelloStage[]>([])
const projects = ref<TrelloProject[]>([])

const is_load = shallowRef<boolean>(false)

const getProjects = async () => {
  try {
    const res = await store.getProjects()
    projects.value = await res.value
  } catch (e) {
    console.log(e)
  }
}

const getStages = async () => {
  try {
    const res = await store.getStages()
    stages.value = await res.value
  } catch (e) {
    console.log(e)
  }
}

const getDataTrello = async () => {
  is_load.value = true
  try {
    await Promise.all([store.getStages(), store.getCards(), store.getProjects()])
    is_load.value = false
  } catch (e) {
    console.log(e)
  }
}

const error_message = ref({
  title: true,
  score: true,
  stage: true,
})
const errorMessage = (key: string) => {
  if(!Number.isFinite(card.value?.score)) card.value.score = card.value?.score?.replace(/[^\d]/g, '')
  !!card.value[key] ? error_message.value[key] = true : error_message.value[key] = false
}

const createCard = () => {
  errorMessage('title')
  errorMessage('score')
  errorMessage('stage')

  if(!Object.keys(error_message.value).some(key => error_message.value[key] === false)) {
    if (!!localStorage.getItem('trello_data')) {
      let trello_data = JSON.parse(localStorage.getItem('trello_data'))
      localStorage.setItem('trello_data', JSON.stringify(
        trello_data.map((stage: TrelloStage) => {
          if(stage.code === card.value.stage) {
            card.value.full_project = projects.value.find(el => card.value.project === el.code)
            stage.cards?.push(toRaw(card.value))
            return stage
          }
          return stage
        })
      ))
      router.push('/')
    }
  }
}

onBeforeMount(getStages)
onBeforeMount(getProjects)
onBeforeMount(getDataTrello)
</script>

<template>
  <Loader v-if="is_load"></Loader>
  <div class="trello-create">
    <div class="trello-create-card" v-if="stages.length && projects.length">
      <div class="trello-create-card__header">
        <div class="trello-create-card__title">Основные данные</div>
      </div>
      <div class="trello-create-card__subtitle">Чтобы добавить карточку, нужно заполнить данные</div>
      <label for="" class="trello-create-card-label">
        <span class="trello-create-card-label__title">Заголовок *:</span>
        <input type="text" class="trello-create-card-label__field" :maxlength="70" @input="errorMessage('title')" v-model="card.title">
        <small v-if="!error_message.title" class="error">Заголовок обязателен</small>
      </label>
      <label class="trello-create-card-label">
        <p class="trello-create-card-label__title">Проект:</p>
        <select class="trello-create-card-label__select" v-model="card.project">
          <option class="trello-create-card-label__option" value="">Не выбрано</option>
          <option v-for="project in projects" :key="project.id" class="trello-create-card-label__option" :value="project.code">{{project.name}}</option>
        </select>
      </label>
      <label class="trello-create-card-label">
        <p class="trello-create-card-label__title">Стадия *:</p>
        <select class="trello-create-card-label__select" @change="errorMessage('stage')" v-model="card.stage">
          <option class="trello-create-card-label__option" value="">Не выбрано</option>
          <option v-for="stage in stages" :key="stage.id" class="trello-create-card-label__option" :value="stage.code">{{stage.name}}</option>
        </select>
        <small v-if="!error_message.stage" class="error">Стадия обязательна</small>
      </label>
      <label class="trello-create-card-label">
        <p class="trello-create-card-label__title">Балл *:</p>
        <input type="text" class="trello-create-card-label__number" @input="errorMessage('score')" v-model="card.score">
        <small v-if="!error_message.score" class="error">Балл обязателен</small>
      </label>
      <div class="trello-create-card__buttons">
        <button class="trello-create-card__button is-primary" @click="createCard">Добавить</button>
        <router-link class="button trello-create-card__button" to="/">Назад</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "trello-create-card.scss";
</style>
