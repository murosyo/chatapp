import sqlite3 from 'sqlite3';
import path from 'node:path';

console.log("データベースに接続開始");
// chatapp/userinfo.dbを開く
const userinfo_db = new sqlite3.Database(path.join(process.cwd(), 'userinfo.db'));
console.log(process.cwd());
// chatapp/chatlog.dbを開く
const chatlog_db = new sqlite3.Database(path.join(process.cwd(), 'chatlog.db'));
console.log("データベースに接続完了");

export default (io, socket) => {
  // 入室メッセージをクライアントに送信する
  socket.on("enterEvent", (userName, password, room, callback) => {
    // console.log(userName, password, room)
    userinfo_db.each("select count(*) from user_info where name = '"+ userName + "' AND password = '" + password + "';", (err, row) => {
      if (row['count(*)'] > 0) {
        callback({
          status:"SIGN IN"
        });
        userinfo_db.each("select name, password from user_info;", (err, row) => {
          console.log(row['name'])
          callback({
            status:"OK"
          });
        })
        socket.broadcast.emit("enterEvent", userName + "さんが" + room + "に入室しました。")
      }
      else {
        callback({
          status:"SIGN UP"
        });
        userinfo_db.each("select name, password from user_info;", (err, row) => {
          console.log(row['name'])
          callback({
            status:"OK"
          });
        })
        userinfo_db.run("INSERT INTO user_info(name, password, room) VALUES('" + userName + "', '" + password + "', '" + room + "');");
        socket.broadcast.emit("enterEvent", userName + "さんが" + room + "に入室しました。")
      }
    }
    )
    // userinfo_db.close();
    // socket.broadcast.emit("enterEvent", data)
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