import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyACNdDziR-vkA5_MWkrcPkNA9R-6lkh9xU",
  authDomain: "line-demo-190ce.firebaseapp.com",
  projectId: "line-demo-190ce",
  storageBucket: "line-demo-190ce.appspot.com",
  messagingSenderId: "166946244649",
  appId: "1:166946244649:web:3fb0729443aa7850877438",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore();
console.log(firebaseApp)

// exportして、他のコンポーネントで使用できるようにする
export { db, auth };

// Vueアプリケーションの作成
createApp(App).use(vuetify).use(router).mount("#app");
