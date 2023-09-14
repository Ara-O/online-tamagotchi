
<template>
  <main>
    <PetVisuals :newPet="newPet" :petName="petName" :petThoughts="petThoughts" :petIsAwake="petIsAwake" />
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
        <Action :tabindex="i" v-for="(action, i) in actions" :class="{ disabled: !petIsAwake }"
          @click="performAction(action as ActionType)">{{ action }}
        </Action>
      </section>
      <section class="action-input-section">
        <input type="text" name="input-field" class="action-input" v-model="actionText"
          :placeholder="`Example: I give ${petName?.toLowerCase() || 'Pet name'} a cake`">
        <Action style="border: solid 1px hotpink" tabindex="5" :class="{ disabled: !petIsAwake }" @click="() =>
          performAction('ACT')">ACT</Action>
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
import { ActionResponseType } from "../../server/types/types.ts"
import PetVisuals from './components/PetVisuals.vue';

let petName = ref<string>("")
let newPet = ref<boolean>(true)
let petIsAwake = ref<boolean>(false)
let error = ref<boolean>(false)
let actionText = ref<string>("")
let petReaction = ref<string>("")
const actions = ref<string[]>(["PET", "FEED", "HUG", "BATH"])

let petThoughts = ref<ActionResponseType[]>([])

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

    if (resp?.id) {
      localStorage.setItem("id", resp.id)
      localStorage.setItem("pet", petName.value)
      newPet.value = false
      startConversation()
    }

  } catch {
    error.value = true
  }
}

type ActionType = "PET" | "HUG" | "FEED" | "BATH" | "ACT"

async function startConversation() {
  fetch(`${import.meta.env.VITE_API_URL}/api/startConversation`, {
    method: "POST",
    body: JSON.stringify({ id: localStorage.getItem("id") }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then((res) => {
    if (!res.ok && res.status == 404) {
      localStorage.setItem("id", "")
      localStorage.setItem("pet", "")
      newPet.value = true
      throw "Your pet was lost to the void :0"
    }

    return res.json()
  }).then((res: ActionResponseType) => {
    petIsAwake.value = true;
    petReaction.value = res?.petResponse[1] || `Something is wrong with ${petName.value} 😟`
    petThoughts.value.push(res)
  }).catch((err) => {
    alert(err)
  })
}

async function performAction(action: ActionType) {

  switch (action) {
    case "FEED":
      petReaction.value = `You are feeding ${petName.value}...`;
      break;
    case "HUG":
      petReaction.value = `You are hugging ${petName.value}...`
      break;
    case "BATH":
      petReaction.value = `You are bathing ${petName.value}...`
      break;
    case "PET":
      petReaction.value = `You are petting ${petName.value}...`
      break;
    case "ACT":
      petReaction.value = `You are performing the action - ${actionText.value}...`
      break
  }

  fetch(`${import.meta.env.VITE_API_URL}/api/performAction`, {
    method: "POST",
    body: JSON.stringify({ id: localStorage.getItem("id"), action, actionText: actionText.value }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then((res) => res.json()).then((res: ActionResponseType) => {

    petThoughts.value.push(res)
    petReaction.value = res?.petResponse[1] || "Something is wrong with " + petName

  }).catch((err) => {
    alert(err)
  })
}

onMounted(async () => {
  let pet = localStorage.getItem("pet")
  let id = localStorage.getItem("id")

  //If pet does not exist, stay on normal page
  if (!pet?.trim() || !id?.trim()) {
    return
  }

  newPet.value = false
  petName.value = pet
  startConversation()
})
</script>