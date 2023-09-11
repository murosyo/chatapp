<script setup>
import { provide, ref } from "vue"
// import axios from 'axios'
// import VueAxios from 'vue-axios'

// VueAxios.use(VueAxios, axios)

// VueAxios.config.productionTip = false

// #region reactive state
const userName = ref("")
const password = ref("")
const chatRoom = ref("")
// #endregion

// #region global variable
provide("userName", userName)
provide("password", password)
provide("chatRoom", chatRoom)
// #endregion
</script>

<template>
  <router-view />
</template>

<style scoped></style>
