<script setup lang="ts">
  import GameState from "@game/store";
  import { computed, ref, watch } from "vue";

  const hoverTilePos = computed(() => {
    if (GameState.hoverTile) {
      return GameState.hoverTile.coordinates;
    }
    return { x: 0, y: 0 };
  });
  const hoverTileColor = computed(() => {
    if (GameState.hoverTile) {
      return GameState.hoverTile.highlightColor;
    } else return 0x000000;
  });
  const inputColor = ref("");

  // watch(inputColor, (val) => {
  //   if (GameState.hoverTile) {
  //     GameState.hoverTile.setEmissive(parseInt(val));
  //   }
  // });
</script>
<template>
  <div class="ui">
    <div class="card">
      <div>q: {{ hoverTilePos.x }}</div>
      <div>r: {{ hoverTilePos.y }}</div>
      <div :style="{ backgroundColor: '#' + hoverTileColor.toString(16) }">
        0x{{ hoverTileColor.toString(16) }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .ui {
    position: fixed;
    pointer-events: none;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10000;
    color: #000;
    padding: 16px;
    .card {
      pointer-events: unset;
      padding: 8px 16px;
      border-radius: 8px;
      background-color: rgba(#333, 0.7);
      position: absolute;
      display: flex;
      gap: 8px;
      div {
        padding: 4px 6px;
        background-color: rgba(#fff, 0.7);
        border-radius: 4px;
      }
    }
  }
</style>
