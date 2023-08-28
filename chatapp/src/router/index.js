import { createRouter, createWebHistory } from "vue-router"
import Login from "../components/Login.vue"
import Chat from "../components/Chat.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Login,
      props:true
    },
    {
      path: "/chat",
      name: 'Chat',
      component: Chat
    },
    {
      path: "/chat1",
      name: 'Chat1',
      component: Chat
    },
    {
      path: "/chat2",
      name: 'Chat2',
      component: Chat
    },
    {
      path: "/chat3",
      name: 'Chat3',
      component: Chat
    },
    {
      path: "/chat4",
      name: 'Chat4',
      component: Chat
    },
    {
      path: "/chat5",
      name: 'Chat5',
      component: Chat
    },
  ],
})

export default router
