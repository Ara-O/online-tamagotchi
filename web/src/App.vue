
<template>
  <main>
    <PetVisuals :newPet="newPet" :petName="petName" :petThoughts="petThoughts" :petIsAwake="petIsAwake" />
    <CreatePetArea v-if="newPet" @petCreated="petCreated"></CreatePetArea>
    <section v-else>
      <section class="actions">
        <Action tabindex="0" v-for="(action) in actions" :class="{ disabled: !petIsAwake }"
          @click="performAction(action as ActionType)">{{ action }}
        </Action>
      </section>
      <section>
        <form @submit.prevent="performAction('ACT')" class="action-input-section">
          <input type="text" name="input-field" class="action-input" v-model="actionText"
            :placeholder="`Example: I give ${petName?.toLowerCase() || 'Pet name'} a cake`">
          <Action style="border: solid 1px hotpink" tabindex="0" :class="{ disabled: !petIsAwake }"
            @click="performAction('ACT')">ACT
          </Action>
        </form>
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
import axios from "axios"
import { onMounted, ref } from 'vue';
import { ActionResponseType, ActionType } from "../../server/types/types.ts"
import PetVisuals from './components/PetVisuals.vue';
import CreatePetArea from './components/CreatePetArea.vue';

let petName = ref<string>("")
let newPet = ref<boolean>(true)
let petIsAwake = ref<boolean>(false)

let actionText = ref<string>("")
let petReaction = ref<string>("")
const actions = ref<string[]>(["PET", "FEED", "HUG", "BATH"])

let petThoughts = ref<ActionResponseType[]>([])

function petCreated(name: string) {
  newPet.value = false
  petName.value = name
  performAction("CREATE")
}

//When the pet is first created, or on re-visit
async function startConversation() {
  axios.post(`${import.meta.env.VITE_API_URL}/api/startConversation`, { id: localStorage.getItem("id"), memory: localStorage.getItem("memory") || "disabled" }).then((res) => {
    if (res.status == 404) {
      localStorage.setItem("id", "")
      localStorage.setItem("pet", "")
      newPet.value = true
      throw "Your pet was lost to the void :0"
    }

    petIsAwake.value = true;
    petReaction.value = res.data?.petResponse[1] || `Something is wrong with ${petName.value} 😟`
    petThoughts.value.unshift(res.data)
  }).catch((err) => {
    alert(err?.response?.data?.message || err)

    if (err?.response?.data?.message === "Pet not found") {
      localStorage.setItem("id", "")
      localStorage.setItem("pet", "")
    }
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
      if (actionText.value.trim() === "") return
      petReaction.value = `You are performing the action - ${actionText.value}...`
      break
  }

  let data = {
    id: localStorage.getItem("id"),
    action,
    actionText: actionText.value,
    memory: localStorage.getItem("memory") || "disabled"
  }

  axios.post(`${import.meta.env.VITE_API_URL}/api/performAction`, data).then((res) => {
    petThoughts.value.unshift(res.data)
    petReaction.value = res.data?.petResponse[1] || "Something is wrong with " + petName.value
  }).catch((err) => {
    alert(err?.response?.data?.message || "There was an error interacting with  " + petName.value + ", please try again later :)")
    petReaction.value = `${petName.value} stares in silence`
  }).finally(() => {
    actionText.value = ""

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