<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import io from "socket.io-client"
import axios from 'axios';

//グローバル変数
const GPT_API = import.meta.env.VITE_TEST
//音声認識を終了するのに必要な変数
let recognition;

// #region global state
const userName = inject("userName")
const password = inject("password")
// #endregion

// #region local variable
const socket = io()
// #endregion

// #region reactive variable
const chatContent = ref("")
const chatList = reactive([])
const userList = reactive([])
const isReversed = ref(false);  // false: 通常順, true: 逆順　メッセージを新しい順、古い順に切り替える機能のため
// #endregion

// #region lifecycle
onMounted(() => {
  props: ['userName'],
    registerSocketEvent()
    socketTest()
})

const socketTest = () => {
  socket.on("enterEvent", (data) => {
    if (!data) {
      return
    }
    onReceiveEnter(data)
  })
}


// #endregion

// #region browser event handler
// 並び替え関数
const reverseMessages = () => {
  chatList.reverse();
};

// 逆順の状態を切り替える関数
const toggleOrder = () => {
  isReversed.value = !isReversed.value;
  reverseMessages();
};

// メッセージのスタイルを設定する関数
const messageStyle = (data) => {
  // if (userName.value === currentUser) {
  //   return {
  //     color: "red",
  //     'white-space': 'pre-line'
  //   }
  // }
  // else {
  //   return {'white-space': 'pre-line'}
  // }
  return {'white-space': 'pre-line'}
}

// 投稿メッセージをサーバに送信する
const onPublish = () => {
  if (recognition) {
    recognition.stop();  // 音声認識を停止
  }
  if (chatContent.value === '') {
    alert('メッセージを入力してください。')
    return;
  }
  // 現在時刻の取得
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土"][dayOfWeek];

  socket.emit("publishEvent", {
    user: userName.value,
    message: chatContent.value,
    time: today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + "/" + dayOfWeekStr + "/" + today.getHours() + "時" + today.getMinutes() + "分" + today.getSeconds() + "秒"
  })
  chatContent.value = null;  // Clear the chat input
}

// 退室メッセージをサーバに送信する
const onExit = () => {
  socket.emit("exitEvent", `${userName.value}さんが退室しました。`)
}

/**
 * 音声認識をしてくれる関数.
 * 画面上で音声ボタンをクリックすると記録が始まり、その内容を入力欄に記入してくれる.
 * ローカルサーバーでのみ録音が可能.
 * http://52.198.163.115:10038/ではこの関数が使えない.
 * 投稿,メモボタンを押すと終了する.
 */
 const onSpeak = () => {
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "ja";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript;
          chatContent.value += transcript;  // 認識した文字をchatContentに追加
        }
      }
    };

    recognition.onerror = (event) => {
      console.error(`エラーが発生: ${event.error}`);
    };

    recognition.start();
  }
};


// メモを画面上に表示する
const onMemo = () => {
  if (recognition) {
    recognition.stop();  // 音声認識を停止
  }
  if (chatContent.value === '') {
    alert('メッセージを入力してください。')
    return;
  }

  // 現在時刻の取得
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土"][dayOfWeek];

  socket.emit("memoEvent", {
    user: userName.value,
    message: chatContent.value,
    time: today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + "/" + dayOfWeekStr + "/" + today.getHours() + "時" + today.getMinutes() + "分" + today.getSeconds() + "秒"
  })
  // 入力欄を初期化
  chatContent.value = null;
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
  chatList.unshift(`［${data.time}］${data.user}さん\n${data.message}`)
}

// サーバから受信したメモメッセージを画面上に表示する
const onReceiveMemo = (data) => {
  chatList.unshift(`［${data.time}］${data.user}さんのメモ\n${data.message}`)
}

// 投稿したメッセージを削除
const deleteChat = (index) => {
  if (confirm("このコメントを削除してもいいですか？")) {
    chatList.splice(index, 1)
  }
}
// #endregion

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
  //test
  socket.on("enterEvent", (userName, password, room, callback) => {
    console.log(userName, password, room, callback)
  })

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
  })

  // メモイベントを受け取ったら実行
  socket.on("memoEvent", (data) => {
    onReceiveMemo(data)
  })
}
// #endregion

/**
 * chatGPTに入力内容を要約させる関数です
 * envでAPIを用意しています
 * envの書き方は "GPT_API=[APIキー]"
 */
const gpting = async () =>  {
  const message = chatContent.value.trim();
  // 以降は同じ
  const prompt = `命令書
TL;TR
あなたはプロの編集者です。以下の制約条件に従って、入力する文章を要約してください。

制約条件
・重要なキーワードを取りこぼさない。
・文章の意味を変更しない。
・架空の表現や言葉を使用しない。
・入力する文章を句読点を含めて100文字以内にまとめて出力。
・要約した文章の句読点を含めた文字数を出力。
・文章中の数値には変更を加えない。
  `;

  //TODO
  console.log(message);
  
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${GPT_API}`,
  };

  const messages = [
    {
      role: "system",
      content: prompt,
    },
    {
      role: "user",
      content: `TL;TR 入力文章を要約してください。返す内容は要約された内容だけでいい。要約した文章の文字数は72文字ですとかいらない/
      - 入力文章: ${message} /
      `,
    }
  ];

  const payload = {
    model: "gpt-3.5-turbo",
    max_tokens: 1000,
    messages: messages,
  };

  try {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    payload,
    { headers: headers }
  );
  chatContent.value = response.data.choices[0].message.content;
  console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.error(error);
    alert("エラーが発生しました。再リロードしてください");
  }

  console.log("結果が返ってきました");
}
</script>

<template>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">楽々おしゃべり</h1>
    <p class="text-h4" margin-top="10px">チャットルーム</p>
    <div class="mt-10">
      <p>
        ログインユーザ：{{ userName }} さん
      <router-link to="/" class="link">
        <button type="button" class="button-normal button-exit" @click="onExit">退室する</button>
      </router-link>
      </p>
      <div class="border">
        <!-- 並び替えボタンの追加 -->
        <p>
        <button type="button" class="button-normal" @click="toggleOrder">{{ isReversed ? "新しいもの順に表示" : "古いもの順に表示"
        }}</button>
        
        <button type="button" class="button-normal" @click="onPublish">投稿する</button>
        <button class="button-normal util-ml-8px" @click="onMemo">メモ</button>
        <button type="button" class="button-normal button-exit" id="gpting" @click="gpting">要約</button>
        </p>
        <textarea placeholder="投稿文を入力してください" outline="none" rows="4" class="area" v-model="chatContent" v-on:keydown.enter="onPublish"></textarea>
        <button type="button" class="button-normal button-post" @click="onPublish">投稿する</button>
        <button type="button" class="button-normal button-exit" @click="onSpeak">音声</button>

      </div>
      <div class="mt-5" v-if="chatList.length !== 0">
        <ul>
          <li class="item mt-4" v-for="(chat, i) in chatList" :key="i" :style="messageStyle(chatList)">{{ chat }} <span
              @click="deleteChat(i)" class="button-normal" v-bind:style="{ color: 'black' }">削除</span></li>
        </ul>
      </div>
    </div>
    <router-link to="/" class="link">
      <button type="button" class="button-normal button-exit" @click="onExit">退室する</button>
    </router-link>
  </div>
</template>

<style scoped>
.button-normal{
  color: #FFF;
  background-color: #ff9d00;
  font-weight: 600;
  border: none;
}
.link {
  text-decoration: none;
}

.area {
  width: 100%;
  outline: none;
  margin-top: 8px;
}

.item {
  display: block;
}

.util-ml-8px {
  margin-left: 8px;
}

.button-exit {
  float: right;
}
.button-post{
  display: block;
  margin-left: auto;
}
.border{
  border: 1px solid #000;
  margin-top: 10px;
}
.text-h3::first-letter{
  font-weight: 600;
  padding: 0.3rem;
  border-radius: 0.5rem;
  color: white;
  background-color: #ff9d00;
}
.text-h4{
  font-size: 40%;
  padding-left: 100px;
}
.border{
  border: 10px solid #000;
}
</style>