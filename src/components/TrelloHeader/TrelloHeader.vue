<script setup lang="ts">
import { onMounted, type PropType, ref } from 'vue'
import type TrelloProject from '@/types/trello-projects'

defineProps({
  projects: {
    type: Array as PropType<TrelloProject[]>,
    default() {
      return []
    }
  },
})

const emit = defineEmits(['project', 'save'])

const select_project = ref()

const selectChange = () => {
  localStorage.setItem('trello_filter', JSON.stringify(select_project.value))
  emit('project', select_project.value)
}

onMounted(() => {
  if (!!localStorage.getItem('trello_filter') && localStorage.getItem('trello_filter') !== 'undefined' && localStorage.getItem('trello_filter') !== 'null') {
    select_project.value = JSON.parse(localStorage.getItem('trello_filter'))
  }
})

</script>

<template>
  <div class="trello-header">
    <div class="trello-header__title">Карточки</div>
    <div class="trello-header__nav">
      <div class="trello-header__project">
        <span>Проект:</span>
        <select class="trello-header__select" @change="selectChange" v-model="select_project">
          <option :value="undefined">Все</option>
          <option
            v-for="project in projects"
            :key="project.id"
            :value="project">{{ project.name }}
          </option>
        </select>
      </div>
      <router-link class="button trello-header__button is-primary" to="create-card">Добавить карточку</router-link>
      <button @click="emit('save')" class="trello-header__button is-primary">Сохранить изменения</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "trello-header.scss";
</style>
