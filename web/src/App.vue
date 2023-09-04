
<template>
  <main>
    <nav></nav>
    <section class="main-section">
      <h3 class="upper">{{ !newPet ? petName : 'ENTER YOUR PET\'S NAME' }}</h3>
      <img src="/heart.gif" alt="heart-gif" class="heart-gif" v-if="petIsHappy">
      <img src="/bunny.gif" class="pet-gif"
        alt="Bunny png, Source: https://www.pixilart.com/art/bunny-gif-3e7007fff017d50">
    </section>
    <br>
    <section v-if="newPet">
      <span class="new-pet-field">
        <input type="text" name="pet-name" placeholder="ENTER PET NAME" v-model="petName"
          class="action-input pet-name-field">
        <Button @click="createPet">CREATE</Button>
      </span>
    </section>
    <section v-else>
      <section class="actions">
        <Action :tabindex="i" v-for="(action, i) in actions">{{ action }}</Action>
      </section>
      <section class="action-input-section">
        <input type="text" name="input-field" class="action-input">
        <Action style="border: solid 1px hotpink" tabindex="5">ACT</Action>
      </section>
      <section class="reaction-section">
        <h3>REACTION</h3>
        <h5 class="reaction-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae tempora dolore ad
          corrupti, est qui unde
          voluptatibus velit. Dolorum totam blanditiis delectus est, corporis adipisci dolorem voluptates eligendi! Dolore
          corporis a consectetur labore fugit consequatur vel quisquam nulla amet. Magnam.</h5>
      </section>
    </section>
  </main>
</template>


<script lang="ts" setup>
import Action from './components/Action.vue';
import Button from "./components/Button.vue"
import { onMounted, ref } from 'vue';

const petIsHappy = ref<boolean>(false)
let petName = ref<string>("")
let newPet = ref<boolean>(true)
const actions = ref<string[]>(["PET", "FEED", "HUG", "BATH"])

function createPet() {
  if (petName.value.trim() === "") {
    petName.value = "Bobby"
  }

  localStorage.setItem("pet", petName.value)
  newPet.value = false
}

onMounted(() => {
  let pet = localStorage.getItem("pet")

  if (pet?.trim()) {
    newPet.value = false
    petName.value = pet
  }
})
</script>