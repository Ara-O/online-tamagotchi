<template>
    <span class="new-pet-field">
        <input type="text" name="pet-name" placeholder="ENTER PET NAME" v-model="petName"
            class="action-input pet-name-field">
        <Button @click="createPet">CREATE</Button>
    </span>
    <h5 class="loading-message" v-if="creatingPet">{{ petName || "Your pet" }} is being created...</h5>
    <h5 v-if="error" class="error">There was an error creating
        your pet. Please try again later</h5>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { ref } from 'vue';
import Button from "./Button.vue"

let creatingPet = ref<boolean>(false)
let error = ref<boolean>(false)
let petName = ref<string>("")

const emits = defineEmits(["petCreated"])
async function createPet() {
    if (petName.value.trim() === "") {
        petName.value = "Bobby"
    }

    error.value = false
    creatingPet.value = true

    try {
        let res = await axios.post(`${import.meta.env.VITE_API_URL}/api/createPet`, {
            petName: petName.value
        })

        if (res.data.id) {
            localStorage.setItem("id", res.data.id)
            localStorage.setItem("pet", petName.value)
            emits("petCreated", petName.value)
        } else {
            throw new Error("No ID found")
        }
    } catch {
        error.value = true
    } finally {
        creatingPet.value = false
    }
}
</script>
