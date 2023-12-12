<template>
  <div id="game">
    <ion-button v-if="showButton" @click="handleClickStart">Start</ion-button>
    <simple-ui />
  </div>
</template>

<script setup lang="ts">
  import GameState from "@/game/store";
  import { IonButton } from "@ionic/vue";
  import { ref } from "vue";
  import SimpleUi from "./SimpleUi.vue";
  import GameHandler from "@engine/GameHandler";
  import PlayScene from "@game/main/PlayScene";
  const game = new GameHandler([PlayScene]);
  // binds to the v-if on our button to toggle visibility
  const showButton = ref(true);

  function handleClickStart() {
    // hides launch button
    showButton.value = false;
    game.startGame();
    GameState.onHoverTileChange();
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
