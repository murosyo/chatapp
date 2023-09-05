<script setup>
import { inject, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import io from "socket.io-client"
// import sqlite3 from 'sqlite3'

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

// console.log("データベースに接続開始");
// const sqlite3 = require('sqlite3');
// const db = new sqlite3.Database('./../../userinfo.db');

// console.log("データベースに接続完了");
// const optionRooms = [ 
//     { id: 1, name: 'Chat1' }, 
//     { id: 2, name: 'Chat2' }, 
//     { id: 3, name: 'Chat3' },
//     { id: 4, name: 'Chat4' },
//     { id: 5, name: 'Chat5' } ];
// #endregion

// const addDB = () => {
//   userinfo_db.each("SELECT * FROM user_info WHERE name = '" + userName.value + "' AND password = '" + password.value + ";"), (err, row) => {
//     if (row.length != 0) {
//       alert('そのユーザ名は既に使用されています。他のユーザ名でログインしてください。')
//       return false
//     }
//     else {
//       alert('ログインに成功しました！')
//       db.run("INSERT INTO user_info(name, password, room) VALUES('" + userName.value + "', '" + password.value + "', " + chatRoom.value + "');");
//     }
//   }
//   db.close();
// }

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
    // socket.emit('enterEvent', inputUserName.value + "さんが入室しました。");
    socket.emit('enterEvent', inputUserName.value, inputPassWord.value, chatRoom.value);

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

  // チャット画面へ遷移
  router.push({ name: "Chat"})
}
// #endregion
</script>

<template>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3">Vue.js Chat</h1>
    <div class="mt-10">
      <table>
      <tr><th>ユーザー名</th><td><input type="text" class="user-name-text" v-model="inputUserName" /></td><td></td></tr>
      <tr><th>パスワード</th><td><input type="password" id="password" class="user-name-text" v-model="inputPassWord" /></td><td><button id="passbtn" @click="checkPassword" class="button-1">パスワード表示</button><br></td></tr>
      <tr><th>チャットルーム</th><td>
      <select id="chatRoom" class="chatroom-list" v-model="chatRoom">
        <option value="">選択してください↓</option>
        <option value="Chat1">Chat1</option>
        <option value="Chat2">Chat2</option>
        <option value="Chat3">Chat3</option>
        <option value="Chat4">Chat4</option>
        <option value="Chat5">Chat5</option>
        <!-- <option v-for="Room in optionRooms" 
          v-bind:value="Room.name" 
          v-bind:key="Room.id">
        {{ Room.name }}
        </option> -->
      </select>
      </td><td></td>
      </tr>
      </table>
    </div>
    <button type="button" @click="onEnter" class="button-2">入室</button>
  </div>
</template>

<style scoped>


.user-name-text {
  width: 200px;
  border: 1px solid #888;
  vertical-align: middle;
}

.chatroom-list {
  position: relative;
}

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

.mt-10{
  width: 80%;
  margin:0 auto;
}

.mt-10 th{
  text-align: left;
  width: 25%;
}
.mt-10 td{
  width: 35%;
}

.button-2{
  border-radius: 3px;
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 auto;
    max-width: 220px;
    padding: 10px 25px;
    color: #FFF;
    transition: 0.3s ease-in-out;
    font-weight: 600;
    background: rgb(149,202,252);
    background: linear-gradient(270deg, rgba(149,202,252,1) 0%, rgba(107,182,255,1) 100%);
}

.button-2{
  background: rgb(117,188,255);
  background: linear-gradient(270deg, rgba(117,188,255,1) 0%, rgba(62,159,252,1) 100%);
}

.text-h3::first-letter{
  color: rgba(62,159,252,1);
}

</style>
