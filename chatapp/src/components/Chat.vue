<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import io from "socket.io-client"

// #region global state
const userName = inject("userName")
// #endregion

// #region local variable
const socket = io()
// #endregion

// #region reactive variable
const chatContent = ref("")
const chatList = reactive([])
// #endregion
// 現在時刻の取得
const today = new Date();

// #region lifecycle
onMounted(() => {
  registerSocketEvent()
})
// #endregion

// #region browser event handler

// ユーザー名をローカルストレージから取得
const currentUser = localStorage.getItem('username');

// メッセージのスタイルを設定する関数
const messageStyle = (messageUser) => {
  console.log(messageUser)
  if (messageUser === currentUser){
  return "color: red;"
  }
}

// 投稿メッセージをサーバに送信する
const onPublish = () => {
  if (chatContent.value.trim() === ''){
    alert('メッセージを入力してください。')
    return;
  }
  // 最後のメッセージのユーザーを取得
  const lastMessageUser = chatList.length > 0 ? chatList[chatList.length - 1].user : null;
  console.log(lastMessageUser)
  // 現在のユーザーと最後のメッセージのユーザーが同じであれば、送信をブロック
  if(userName.value === lastMessageUser){
    alert('連続してメッセージを送信することはできません。')
    return;
  }
  socket.emit("publishEvent",{user: userName.value,
                              message:chatContent.value,
                              time:`${today.getFullYear()}/${(today.getMonth() + 1)}/${today.getDate()}/${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`})
  chatContent.value = "";  // Clear the chat input

}

// 退室メッセージをサーバに送信する
const onExit = () => {
  socket.emit("exitEvent",`${userName.value}さんが退室`)
}

// メモを画面上に表示する
const onMemo = () => {
  // メモの内容を表示
  const memo = `${userName.value}さんのメモ${chatContent.value}`
  chatList.unshift(memo)
  // 入力欄を初期化
  chatContent.value=""
}
// #endregion

// #region socket event handler
// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
  chatList.unshift(data)
}

// サーバから受信した退室メッセージを受け取り画面上に表示する
const onReceiveExit = (data) => {
  chatList.unshift(data)
}

// サーバから受信した投稿メッセージを画面上に表示する
const onReceivePublish = (data) => {
  chatList.push(data)
}
// #endregion

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
  // 入室イベントを受け取ったら実行
  socket.on("enterEvent", (data) => {
    if (!data) {
      return
    }
    onReceiveEnter(data)
  })

  // 退室イベントを受け取ったら実行
  socket.on("exitEvent", (data) => {
    if (!data) {
      return
    }
    onReceiveExit(data)
  })



  // 投稿イベントを受け取ったら実行
  socket.on("publishEvent", (data) => {
    onReceivePublish(data)
  }
  )
}
// #endregion
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat チャットルーム</h1>
    <div class="mt-10">
      <p>ログインユーザ：{{ userName }}さん</p>
      <textarea variant="outlined" placeholder="投稿文を入力してください" rows="4" class="area" v-model="chatContent"></textarea>
      <div class="mt-5">
        <button type="button" class="button-normal" @click="onPublish">投稿する</button>
        <button class="button-normal util-ml-8px" @click="onMemo">メモ</button>
      </div>
      <div class="mt-5" v-if="chatList.length !== 0">
        <ul>
          <li class="item mt-4" v-for="(chat, i) in chatList" :key="i" :style="messageStyle(chat.user)">{{ chat }}</li>
        </ul>
      </div>
    </div>
    <router-link to="/" class="link">
      <button type="button" class="button-normal button-exit" @click="onExit">退室する</button>
    </router-link>
  </div>
</template>

<style scoped>
.link {
  text-decoration: none;
}

.area {
  width: 500px;
  border: 1px solid #000;
  margin-top: 8px;
}

.item {
  display: block;
}

.util-ml-8px {
  margin-left: 8px;
}

.button-exit {
  color: #000;
  margin-top: 8px;
}
</style>
