<script setup lang="ts">

</script>

<template>
  <div class="loader">
    <span class="loader__circle"></span>
  </div>
</template>

<style scoped lang="scss">
.loader {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  background-color: hsl(0deg 0% 0% / 26%);

  &__circle {
    width: 70px;
    height: 70px;
    border: 10px solid #FFF;
    border-bottom-color: #FF3D00;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
