import { createRouter, createWebHistory } from "vue-router"
import Login from "../components/Chat.vue"
import Chat from "../components/Login.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Login
    },{
      path: "/chatroom",
      component: Chat
    }
  ],
})

export default router