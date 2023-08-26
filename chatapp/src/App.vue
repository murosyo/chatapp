<script setup>
import { provide, ref } from "vue"

// #region reactive state
const userName = ref("")

const password = ref("")
// #endregion

// #region global variable
provide("userName", userName)
provide("password", password)
// #endregion
</script>

<template>
  <router-view />
</template>

<style scoped>
</style>
