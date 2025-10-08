<template>
  <span>
    <form @submit.prevent="createPet" class="new-pet-field">
      <input
        type="text"
        name="pet-name"
        placeholder="ENTER PET NAME"
        v-model="petName"
        class="action-input pet-name-field"
        required
      />
      <input
        type="text"
        name="pet-personality"
        placeholder="ENTER PET PERSONALITY"
        v-model="petPersonality"
        class="action-input pet-name-field"
        required
      />
      <Button type="submit">CREATE</Button>
    </form>
  </span>
  <h5 class="loading-message" v-if="creatingPet">
    {{ petName || "Your pet" }} is being created...
  </h5>
  <h5 v-if="error" class="error">
    There was an error creating your pet. Please try again later
  </h5>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Button from "./Button.vue";

let creatingPet = ref<boolean>(false);
let error = ref<boolean>(false);
const petName = ref<string>("");
const petPersonality = ref<string>("");

const emits = defineEmits(["petCreated"]);

async function createPet() {
  if (petName.value.trim() === "") {
    petName.value = "Bobby";
  }

  error.value = false;
  creatingPet.value = true;

  emits("petCreated", petName.value, petPersonality.value);
}
</script>
