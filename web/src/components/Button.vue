<template>
    <button>
        <slot></slot>
    </button>
</template>

<style scoped>
button {
    background: hotpink;
    border: none;
    height: 100%;
    font-family: 'Poppins';
    padding: 0px 20px;
    font-size: 12px;
    cursor: pointer;
    font-weight: 500;
    color: white;
    height: 43px;
    border-radius: 7px;
    transition: all 200ms;
}

button:hover {
    background-color: rgb(247, 88, 167);
}
</style>