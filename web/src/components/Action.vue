
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
  transition: all 500ms ease-in-out;
  cursor: pointer;
  height: 30px;
  width: auto;
  align-items: center;
  display: flex;
  gap: 15px;
  padding: 8px 23px;
  border-radius: 4px;
  background: white;
  border: 1px solid rgba(255, 255, 255, 0.20);
  box-shadow: -1px 2px 3px 0px rgba(232, 232, 232, 0.88), 2px 0px 4px 0px rgba(195, 195, 195, 0.25);
}

.action-container:focus,
.action-container:hover {
  transition: all 250ms;
  outline: none;
  border: solid 1px #FF4081;
}

.action-text {
  font-weight: 400;
  color: #FF4081;
  font-size: 14px;
}

img {
  width: 16px;
}
</style>
