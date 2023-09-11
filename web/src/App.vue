
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
      <h5 v-if="error" style="text-align: center; font-weight: 200;color: red">There was an error creating
        your pet</h5>
    </section>
    <section v-else>
      <section class="actions">
        <Action :tabindex="i" v-for="(action, i) in actions" @click="performAction(action)">{{ action }}</Action>
      </section>
      <section class="action-input-section">
        <input type="text" name="input-field" class="action-input">
        <Action style="border: solid 1px hotpink" tabindex="5">ACT</Action>
      </section>
      <section class="reaction-section">
        <h3>REACTION</h3>
        <h5 class="reaction-text">{{ petReaction || `${petName} is waking up...` }}</h5>
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
let error = ref<boolean>(false)
let petReaction = ref<string>("")
const actions = ref<string[]>(["PET", "FEED", "HUG", "BATH"])

async function createPet() {
  if (petName.value.trim() === "") {
    petName.value = "Bobby"
  }

  try {
    let res = await fetch(`${import.meta.env.VITE_API_URL}/api/createPet`, {
      method: "POST",
      body: JSON.stringify({
        petName: petName.value
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    let resp = await res.json()

    if (resp.id) {
      localStorage.setItem("id", resp.id)
      localStorage.setItem("pet", petName.value)
      newPet.value = false
      startConversation()
    }

  } catch {
    error.value = true
  }
}

async function startConversation() {
  fetch(`${import.meta.env.VITE_API_URL}/api/startConversation`, {
    method: "POST",
    body: JSON.stringify({ id: localStorage.getItem("id") }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then((res) => {
    console.log("Error: ", res)
    if (!res.ok && res.status == 404) {
      localStorage.setItem("id", "")
      localStorage.setItem("pet", "")
      newPet.value = true
      throw "Your pet was lost to the void :0"
    }

    return res.json()
  }).then((res: any) => {
    console.log("reaction", res)
    petReaction.value = res.message || `Something is wrong with ${petName.value} 😟`
  }).catch((err) => {
    alert(err)
  })
}

async function performAction(action: string) {
  fetch(`${import.meta.env.VITE_API_URL}/api/performAction`, {
    method: "POST",
    body: JSON.stringify({ id: localStorage.getItem("id"), action }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then((res) => res.json()).then((res: any) => {
    console.log("action res: ", res)
  }).catch((err) => {
    alert(err)
  })
}

onMounted(async () => {
  let pet = localStorage.getItem("pet")
  let id = localStorage.getItem("id")

  //If pet does not exist, stay on normalpage
  if (!pet?.trim() || !id?.trim()) {
    return
  }

  newPet.value = false
  petName.value = pet
  startConversation()
})
</script>