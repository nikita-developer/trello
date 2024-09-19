<script setup lang="ts">
import { computed, type PropType, ref, toRaw } from 'vue'
import type TrelloStage from '@/types/trello-stage'
import type TrelloProject from '@/types/trello-projects'
import type TrelloCard from '@/types/trello-card'

const props = defineProps({
  card: {
    type: Object as PropType<TrelloCard>,
    default() {
      return {}
    }
  },
  stages: {
    type: Array as PropType<TrelloStage[]>,
    default() {
      return []
    }
  },
  projects: {
    type: Array as PropType<TrelloProject[]>,
    default() {
      return []
    }
  },
})

const emit = defineEmits(['update', 'close'])

const error_message = ref({
  title: true,
  score: true,
  stage: true,
})
const errorMessage = (key: string) => {
  if(!Number.isFinite(card.value?.score)) card.value.score = card.value?.score?.replace(/[^\d]/g, '')
  !!card.value[key] ? error_message.value[key] = true : error_message.value[key] = false
}

const card = computed<TrelloCard>(() => props.card)

const update = () => {
  errorMessage('title')
  errorMessage('score')
  errorMessage('stage')

  if(!Object.keys(error_message.value).some(key => error_message.value[key] === false)) {
    card.value.full_project = props.projects.find(el => el.code === card.value?.project)
    emit('update', card.value)
    emit('close')
  }
}
</script>

<template>
  <div class="modal">
    <div class="modal__background" @click="emit('close')"></div>
    <div class="modal__body">
      <div class="trello-modal-card">
        <div class="trello-modal-card__header">
          <div class="trello-modal-card__title">Редактирование</div>
          <div class="trello-modal-card__close" @click="emit('close')"><img src="../../../assets/img/close.svg" alt="Закрыть"></div>
        </div>
        <label class="trello-modal-card-label">
          <span class="trello-modal-card-label__title">Заголовок *:</span>
          <input type="text" class="trello-modal-card-label__field" :maxlength="70" @input="errorMessage('title')" v-model="card.title">
          <small v-if="!error_message.title" class="error">Заголовок обязателен</small>
        </label>
        <label class="trello-modal-card-label">
          <p class="trello-modal-card-label__title">Проект:</p>
          <select class="trello-modal-card-label__select" v-model="card.project">
            <option class="trello-modal-card-label__option" value="">Не выбрано</option>
            <option v-for="project in projects" :key="project.id" class="trello-modal-card-label__option" :value="project.code">{{project.name}}</option>
          </select>
        </label>
        <label class="trello-modal-card-label">
          <p class="trello-modal-card-label__title">Стадия *:</p>
          <select class="trello-modal-card-label__select" @change="errorMessage('stage')" v-model="card.stage">
            <option class="trello-modal-card-label__option" value="">Не выбрано</option>
            <option v-for="stage in stages" :key="stage.id" class="trello-modal-card-label__option" :value="stage.code">{{stage.name}}</option>
          </select>
          <small v-if="!error_message.stage" class="error">Стадия обязательна</small>
        </label>
        <label class="trello-modal-card-label">
          <p class="trello-modal-card-label__title">Балл *:</p>
          <input type="text" class="trello-modal-card-label__number" @input="errorMessage('score')" v-model="card.score">
          <small v-if="!error_message.score" class="error">Балл обязателен</small>
        </label>
        <div class="trello-modal-card__buttons">
          <button class="trello-modal-card__button is-primary" @click="update">Изменить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../trello-modal-card.scss";
</style>
