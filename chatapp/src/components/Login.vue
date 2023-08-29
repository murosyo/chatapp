<script setup>
import { inject, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import io from "socket.io-client"
import sqlite3 from 'sqlite3'

// #region global state
const userName = inject("userName")
const password = inject("password")
// #endregion

// #region local variable
const router = useRouter()
const socket = io()
// #endregion

// #region reactive variable
const inputUserName = ref("")
const inputPassWord = ref("")
const chatRoom = ref("")

var db = new sqlite3.Database('userinfo.db');

// const optionRooms = [ 
//     { id: 1, name: 'Chat1' }, 
//     { id: 2, name: 'Chat2' }, 
//     { id: 3, name: 'Chat3' },
//     { id: 4, name: 'Chat4' },
//     { id: 5, name: 'Chat5' } ];
// #endregion

const addDB = () => {
  db.serialize(function () {
    var stmt = db.prepare("")
  })
}

// #region browser event handler
const Info = () => {
  userName.value = inputUserName.value;
  password.value = inputPassWord.value;
  chatRoom.value = chatRoom.value;
}

// 入室メッセージをクライアントに送信する
const onEnter = () => {
  // ユーザー名が入力されているかチェック
  if (inputUserName.value.trim() === '') {
    alert('ユーザ名を入力してください。')
  }
  else {
    // 入室メッセージを送信
    socket.emit('enterEvent', inputUserName.value + "さんが入室しました。");

    // 全体で使用するnameに入力されたユーザー名を格納
    userName.value = inputUserName.value;
    // チャットルームへのパス
    const path = document.getElementById('chatRoom').value;
    // ユーザー名をローカルストレージに保存
    // localStorage.setItem("data", JSON.stringify({ 'username': inputUserName.value, 'password': inputPassWord.value }));

    // チャット画面へ遷移
    // router.push({ name: "Chat"})

    // const room = document.chatRoom;
    // const num = room.selectedIndex;
    // const path = room.options[num].value;
    // console.log(room)
    // console.log(num)
    // console.log(path)
    router.push({ name: `${path}` })
  }
}

const checkPassword = () => {
  var txtPass = document.getElementById("password");
  var passbtn = document.getElementById("passbtn");
  if (txtPass.type === "text") {
    txtPass.type = "password";
    passbtn.innerText = "パスワード表示";
  } else {
    txtPass.type = "text";
    passbtn.innerText = "パスワード非表示";
  }
}
// #endregion
</script>

<template>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat サンプル</h1>
    <div class="mt-10">
      <p>ユーザー名</p>
      <input type="text" class="user-name-text" v-model="inputUserName" />
      <p>パスワード</p>
      <input type="password" id="password" class="user-name-text" v-model="inputPassWord" /><button id="passbtn"
        @click="checkPassword">パスワード表示</button><br>
      <select id="chatRoom" class="chatroom-list" v-model="chatRoom">
        <option disabled value="">チャットルーム一覧 ▼</option>
        <option>Chat1</option>
        <option>Chat2</option>
        <option>Chat3</option>
        <option>Chat4</option>
        <option>Chat5</option>
        <!-- <option v-for="Room in optionRooms" 
          v-bind:value="Room.name" 
          v-bind:key="Room.id">
        {{ Room.name }}
        </option> -->
      </select>
    </div>
    <button type="button" @click="onEnter" class="button-normal">入室する</button>
  </div>
</template>

<style scoped>
.user-name-text {
  width: 200px;
  border: 1px solid #888;
  margin-bottom: 16px;
}

.chatroom-list {
  position: relative;
}

.chatroom-list::before,
.chatroom-list::after {
  position: absolute;
  content: '';
  pointer-events: none;
}

.chatroom-list::before {
  right: 0;
  display: inline-block;
  width: 2.8em;
  height: 2.8em;
  border-radius: 0 25px 25px 0;
  background-color: #2589d0;
  content: '';
}

.chatroom-list::after {
  position: absolute;
  top: 50%;
  right: 1.4em;
  transform: translate(50%, -50%) rotate(45deg);
  width: 6px;
  height: 6px;
  border-bottom: 3px solid #fff;
  border-right: 3px solid #fff;
  content: '';
}

.chatroom-list select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  min-width: 230px;
  height: 2.8em;
  padding: .4em 3.6em .4em .8em;
  border: 2px solid #2589d0;
  border-radius: 25px;
  color: #333333;
  font-size: 1em;
  cursor: pointer;
}

.chatroom-list select:focus {
  outline: 1px solid #2589d0;
}
</style>
