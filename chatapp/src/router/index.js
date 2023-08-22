import { createRouter, createWebHistory } from "vue-router"
import Login from "../components/Login.vue"
import Chat from "../components/Chat.vue"

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