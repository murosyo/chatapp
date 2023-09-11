import { createRouter, createWebHistory } from "vue-router"
import Login from "../components/Login.vue"
import Chat from "../components/Chat.vue"
import Dev from "../components/Dev.vue"
import General from "../components/General.vue"
import Report from "../components/Report.vue"
import Emergency from "../components/Emergency.vue"

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
      component: Chat,
      // props:true
    },
    {
      path: "/chat1",
      name: 'Chat1',
      component: Chat,
      props:true
    },
    {
      path: "/chat2",
      name: 'Chat2',
      component: Dev,
    },
    {
      path: "/chat3",
      name: 'Chat3',
      component: General
    },
    {
      path: "/chat4",
      name: 'Chat4',
      component: Report
    },
    {
      path: "/chat5",
      name: 'Chat5',
      component: Emergency
    },
  ],
})

export default router