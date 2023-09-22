<template>
  <div id="game">
    <ion-button v-if="showButton" @click="handleClickStart">Start</ion-button>
  </div>
</template>

<script setup lang="ts">
  import GameState from "@/game/store";
  import { IonButton } from "@ionic/vue";
  import { launch } from "@/game/game";
  import { ref } from "vue";
  GameState.onHoverTileChange();

  // binds to the v-if on our button to toggle visibility
  const showButton = ref(true);

  function handleClickStart() {
    // hides launch button
    showButton.value = false;

    // Runs the launch function
    launch();
  }
</script>

<style scoped>
  #game {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }
</style>
