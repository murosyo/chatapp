import sqlite3 from 'sqlite3';
import path from 'node:path';

console.log("データベースに接続開始");
// chatapp/userinfo.dbを開く
const userinfo_db = new sqlite3.Database(path.join(process.cwd(), 'userinfo.db'));

// chatapp/chatlog.dbを開く
const chatlog_db = new sqlite3.Database(path.join(process.cwd(), 'chatlog.db'));
console.log("データベースに接続完了");

export default (io, socket) => {
  // 入室メッセージをクライアントに送信する
  socket.on("enterEvent", (userName, password, room) => {
    userinfo_db.each("SELECT * FROM user_info WHERE name = '" + userName.value + "' AND password = '" + password.value + ";"), (err, row) => {
      if (row.length != 0) {
        alert('そのユーザ名は既に使用されています。他のユーザ名でログインしてください。')
        return false
      }
      else {
        alert('ログインに成功しました！')
        userinfo_db.run("INSERT INTO user_info(name, password, room) VALUES('" + userName.value + "', '" + password.value + "', " + chatRoom.value + "');");
      }
    }
    userinfo_db.close();
    // socket.broadcast.emit("enterEvent", data)
    socket.broadcast.emit("enterEvent", userName.value + "さんが" + room.value + "に入室しました。")
  })

  // 退室メッセージをクライアントに送信する
  socket.on("exitEvent", (data) => {
    socket.broadcast.emit("exitEvent", data)
  })

  // 投稿メッセージを送信する
  socket.on("publishEvent", (data) => {
    io.sockets.emit("publishEvent", data)
  })

  // メモメッセージを自クライアントのみに送信する
  socket.on("memoEvent", (data) => {
    socket.emit("memoEvent", data)
  })
}