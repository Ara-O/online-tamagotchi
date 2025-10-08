<template>
  <main>
    <PetVisuals
      :newPet="newPet"
      :petName="petName"
      :petThoughts="history"
      :petIsAwake="petIsAwake"
    />
    <CreatePetArea v-if="newPet" @petCreated="petCreated"></CreatePetArea>
    <section v-else>
      <section class="actions">
        <Action
          tabindex="0"
          v-for="action in actions"
          :class="{ disabled: !petIsAwake }"
          @click="performAction(action as ActionType)"
          >{{ action }}
        </Action>
      </section>
      <section>
        <form
          @submit.prevent="performAction(actionText)"
          class="action-input-section"
        >
          <input
            type="text"
            name="input-field"
            class="action-input"
            v-model="actionText"
            :placeholder="`Example: I give ${
              petName?.toLowerCase() || 'Pet name'
            } a cake`"
          />
          <Action
            style="border: solid 1px hotpink"
            tabindex="0"
            :class="{ disabled: !petIsAwake }"
            >ACT
          </Action>
        </form>
      </section>
      <section class="reaction-section">
        <h3>REACTION</h3>
        <h5 class="reaction-text">
          {{ petReaction || `${petName} is waking up...` }}
        </h5>
      </section>
    </section>
  </main>
</template>

<script lang="ts" setup>
import Action from "./components/Action.vue";
import axios from "axios";
import { ref } from "vue";
import { ActionType } from "../../server/types/types.ts";
import PetVisuals from "./components/PetVisuals.vue";
import CreatePetArea from "./components/CreatePetArea.vue";

let petName = ref<string>("");
let newPet = ref<boolean>(true);
let petIsAwake = ref<boolean>(true);

let actionText = ref<string>("");
let petReaction = ref<string>("");
const petPersonality = ref<string>("");

const actions = ref<string[]>(["PET", "FEED", "HUG", "BATH"]);

function petCreated(name: string, personality: string) {
  newPet.value = false;
  petName.value = name;
  petPersonality.value = personality;
}
const humanAction = ref<string>("");
const history = ref<any[]>([]);

async function performAction(action: string) {
  console.log(action);
  try {
    switch (action) {
      case "CREATE":
        humanAction.value = `You are waking ${petName.value} up...`;
        break;
      case "FEED":
        humanAction.value = `You are feeding ${petName.value}...`;
        break;
      case "HUG":
        humanAction.value = `You are hugging ${petName.value}...`;
        break;
      case "BATH":
        humanAction.value = `You are bathing ${petName.value}...`;
        break;
      case "PET":
        humanAction.value = `You are petting ${petName.value}...`;
        break;
      default:
        if (actionText.value.trim() === "") return;
        humanAction.value = `${actionText.value}...`;
        break;
    }

    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/action`, {
      name: petName.value,
      personality: petPersonality.value,
      action: action,
      history: history.value,
    });

    history.value.unshift({ role: "Human", action: humanAction.value });
    //   petIsAwake.value = true
    history.value.unshift({ role: "Pet", action: `${res.data.response}` });

    petReaction.value =
      res.data?.response || `${petName.value} stares at you insilence.`;
  } catch (err) {
    console.log(err);
    petReaction.value = `${petName.value} stares at you insilence.`;
  }
}
</script>
