<script setup lang="ts">
import Action from './components/Action.vue';

</script>

<template>
  <main>
    <nav></nav>
    <section class="main-section">
      <h3>BRAD</h3>
      <img src="/bunny.gif" class="pet-gif"
        alt="Bunny png, Source: https://www.pixilart.com/art/bunny-gif-3e7007fff017d50">
    </section>
    <br>
    <section class="actions">
      <Action>Pet</Action>
      <Action>Feed</Action>
      <Action>Hug</Action>
      <Action>Bath</Action>
    </section>
  </main>
</template>


