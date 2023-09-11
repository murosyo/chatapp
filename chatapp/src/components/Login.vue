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


// 入室メッセージをクライアントに送信する
const onEnter = () => {
  // ユーザー名が入力されているかチェック
  if (inputUserName.value.trim() === '') {
    alert('ユーザ名を入力してください。')
  }
  else {
    // 入室メッセージを送信
    // socket.emit('enterEvent', inputUserName.value + "さんが入室しました。");
    socket.emit('enterEvent', inputUserName.value, inputPassWord.value, chatRoom.value, (response) => {
      console.log(response.status);
      console.log(response.name);
      console.log(response.password);
      console.log(response.room);
      console.log(response.data);
      if(response.status === "SIGN IN"){
        alert('サインインに成功しました！');
        userName.value = inputUserName.value;
        const path = document.getElementById('chatRoom').value;
        router.push({ name: `${path}` })
      }
      else if(response.status === "SIGN UP"){
        alert('サインアップに成功しました！');
        userName.value = inputUserName.value;
        const path = document.getElementById('chatRoom').value;
        router.push({ name: `${path}` })
      }
      else{
        alert('そのユーザ名は既に使用されています。他のユーザ名でログインしてください。');
        inputUserName.value = "";
        inputPassWord.value = "";
      }
    });
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
  <div class="page">
    <h1 class="text-h3">楽々チャット</h1>
    <div class="mt-10">
      <table>
      <tr><th>ユーザー名</th><td><input type="text" class="user-name-text" v-model="inputUserName" /></td><td></td></tr>
      <tr><th>パスワード</th><td><input type="password" id="password" class="user-name-text" v-model="inputPassWord" /></td><td><button id="passbtn" @click="checkPassword" class="button-1">パスワード表示</button><br></td></tr>
      <tr><th>チャットルーム</th><td>
      <select id="chatRoom" class="chatroom-list" v-model="chatRoom">
        <option disabled value="">選択してください↓</option>
        <option value="Chat1">Chat1</option>
        <option value="Chat2">Chat2</option>
        <option value="Chat3">Chat3</option>
        <option value="Chat4">Chat4</option>
        <option value="Chat5">Chat5</option>
      </select>
      </td><td></td>
      </tr>
      </table>
    </div>
    <button type="button" @click="onEnter" class="button-2">入室</button>
  </div>
</template>

<style scoped>

.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
}

.user-name-text {
  width: 200px;
  border: 1px solid #888;
  vertical-align: middle;
  margin-top: 5px;
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
  margin: 0 auto;
  width: fit-content;
}

.mt-10 th{
  text-align: left;
  width: 30%;

}
.mt-10 td{
  width: 50%;
}
.mt-10 table {
  border-collapse: separate;
  border-spacing: 0 15px;
}

.button-2 {
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 2rem;
  font-size: 1.2rem;
  background-color: rgb(253,154,5); /* 色を変更 */
  text-shadow: 1px 1px 0 #df922d, -1px -1px 0 #df9d33;
  box-shadow: 0 10px 0 0 #a47943;
  color: rgb(251, 251, 251);
  font-weight: bold;
  border: 1px solid #7d7d7a;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 30px;
  margin-bottom: 30px;
}

.button-2:hover {
  background-color: rgb(253,154,5); /* ホバー時の色を変更 */
  text-shadow: 1px 1px 0 #daa344, -1px -1px 0 #e0a031;
  transform: translateY(10px);
  box-shadow: none;
}

.button-1{
  font-weight: 600;
  color: #FFF;
  background-color: #e59a29;
  border-radius: 10px;
}

.text-h3::first-letter{
  color: rgb(253,154,5);
}

.text-h3 {
  text-align: center;
  /* 既存のスタイルがあればここに */
  /* ... */
}

.text-h3 {
  font-family: 'Georgia', serif;
  /* 既存のスタイルはそのまま */
}

</style>