<template>
  <div id="game">
    <ion-button v-if="showButton" @click="handleClickStart">Start</ion-button>
  </div>
</template>

<script setup lang="ts">
  import GameState from "@/game/store";
  import { IonButton } from "@ionic/vue";
  import { nextTick, ref, unref } from "vue";
  import GameHandler from "@engine/GameHandler";
  import PlayScene from "@game/main/PlayScene";
  import router from "@/router";
  // binds to the v-if on our button to toggle visibility
  const showButton = ref(true);

  async function handleClickStart() {
    // hides launch button
    await nextTick();
    showButton.value = false;
    const game = new GameHandler();

    game.startGame();
    const gameSizeParam = unref(router.currentRoute).query["size"] as string;
    console.log(parseInt(gameSizeParam || "0"));
    game.initScenes([new PlayScene(parseInt(gameSizeParam || "2"))]);
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
