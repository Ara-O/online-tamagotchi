<template>
    <section class="top-section" :class="{ disabled: !petIsAwake && !newPet }">
        <!-- Bunny area -->
        <article>
            <h3 class="upper" :title="petName">{{ !newPet ? formatPetName(petName) : 'ENTER YOUR PET\'S NAME' }}</h3>
            <img src="/heart.gif" alt="heart-gif" class="heart-gif">
            <img src="/bunny.gif" class="pet-gif"
                alt="Bunny png, Source: https://www.pixilart.com/art/bunny-gif-3e7007fff017d50">
        </article>

        <!-- Bunny's thought area -->
        <article class="pet-thought-section" v-if="!newPet">
            <h1>{{ petName?.toUpperCase() }}'s THOUGHTS</h1>
            <div class="thoughts-bubble-container" ref="thoughBubbleContainer">
                <div v-for="(thought, i) in petThoughts">
                    <div class="pet-bubble" :class="{ last: i === petThoughts.length - 1 }">
                        <h5>{{ petName }}'s' thought: </h5>
                        <h3>{{ parseThought(thought.petThought) }} </h3>
                    </div>
                    <br>
                    <div class="interviewer-bubble">
                        <h5>Action: </h5>
                        <h3>{{ thought.actionPrompt }} </h3>
                    </div>
                </div>
            </div>
        </article>
    </section>
</template>

<script setup lang="ts">
import { ActionResponseType } from '../../../server/types/types';
const props = defineProps<{
    newPet: boolean,
    petName: string,
    petThoughts: ActionResponseType[],
    petIsAwake: boolean
}>()

function formatPetName(name: string) {
    if (name.length > 12) {
        return name.slice(0, 12) + "..."
    }
    return name
}

function parseThought(thought: string) {
    let changedThought = thought.replace(`${props.petName} said`, "")
    changedThought = changedThought.replaceAll(`"`, "")
    return changedThought
}
</script>

<style scoped>
.top-section {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    justify-content: center;
    position: relative;
    padding: 0px;
    gap: 30px;
    color: rgb(83, 83, 83);
    transition: all 500ms ease-in-out;
    margin-bottom: 40px;
}

.top-section article:nth-child(1) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.top-section article:nth-child(2) {
    border: solid 1.5px #ff9bbc;
    height: 100%;
    width: 250px;
    box-sizing: border-box;
    padding: 10px 20px;
}

.pet-thought-section h1 {
    font-size: 15px;
    color: #FF4081;
}

.interviewer-bubble {
    font-size: 11.5px;
    border: solid 1px #ff9bbc;
    box-sizing: border-box;
    padding: 0px 20px;
    color: #FF4081
}

.pet-bubble {
    font-size: 11.5px;
    border: solid 1px #ff9bbc;
    box-sizing: border-box;
    padding: 0px 20px;
    color: #FF4081
}

.thoughts-bubble-container {
    max-height: 200px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 30px
}
</style>
