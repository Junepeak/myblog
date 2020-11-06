<template>
  <div id="app">
    <img class="bgimg" src="./assets/images/gb.jpg" />

    <!-- router 中引入的所有组件都在这里显示 -->
    <!-- 
      为组件设置 key，每次加载组件时都相当于加载一个新的组件，而不会去缓存里面找
      可解决数据更新问题
     -->
    <router-view :key="Date.now()" />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.bgimg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1000;
  width: 100vw;
  height: 100vh;
}
</style>
