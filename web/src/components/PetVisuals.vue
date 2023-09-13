<template>
    <section class="top-section">
        <article>
            <h3 class="upper">{{ !newPet ? petName : 'ENTER YOUR PET\'S NAME' }}</h3>
            <img src="/heart.gif" alt="heart-gif" class="heart-gif">
            <img src="/bunny.gif" class="pet-gif"
                alt="Bunny png, Source: https://www.pixilart.com/art/bunny-gif-3e7007fff017d50">
        </article>
        <article>
            <h6>{{ petName?.toUpperCase() }}'s THOUGHTS</h6>
        </article>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    newPet: boolean,
    petName: string
}>()
</script>