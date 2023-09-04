
<template>
  <div class="action-container">
    <img src="/heart-icon.png" alt="Heart icon">
    <h3 class="action-text">
      <slot></slot>
    </h3>
  </div>
</template>


<style scoped>
.action-container {
  cursor: pointer;
  height: 30px;
  width: auto;
  align-items: center;
  display: flex;
  gap: 15px;
  padding: 9px 25px;
  border-radius: 4px;
  border: solid 1px rgb(218, 218, 218);
  background: white;
  border: 1px solid rgba(255, 255, 255, 0.20);
  box-shadow: -1px 2px 3px 0px rgba(223, 223, 223, 0.88), 2px 0px 4px 0px rgba(195, 195, 195, 0.25);
}

.action-text {
  font-weight: 400;
  color: #FF4081;
  font-family: sans-serif;
  font-size: 16px;
}

img {
  width: 15px;
}
</style>
