//開始連線
let socket = new WebSocket(`ws://${location.host}`);
//登入檢查  這邊直接用token檢查
fetch("http://localhost:3001/LoginCheck/" + chooseWhoString[who], {
  method: "POST",
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
    mode: "cors",
    Authorization: "Bearer " + localStorage.getItem(chooseWhoString[who]),
  },
})
  .then((r) => r.json())
  .then((res) => {
    console.log({ res });
    //後端檢查完之後 送結果回來決定
    if (res === 0) {
      alert("未登入");
      //再重新導向
    } else {
      //自動送發言人是哪方
      socket.send(`{"post_side":1}`);
    }
  });

//輸入區
const msg = document.querySelector("#msg");
//輸出框
const textBox = document.querySelector(".textBox");

//伺服器連接
socket.addEventListener("open", () => {
  console.log("start");
});
//接收資料
socket.addEventListener("message", (e) => {
  //回傳的資料
  //let sendData = { "msg": content, "name": map.get(ws).name, "post_side": postSide, "post_sid": postSid, "receive_side": receiveSide, "receive_sid": receiveSid, "time": timeNow /*[,"read",true已讀]*/};
  //接受後再決定要怎麼顯示
  const datas = JSON.parse(e.data);
  console.log(datas);
});
//發送資料
function sendMsg() {
  //輸入欄不為空才發文
  if (msg.value.trim()) {
    socket.send(              //      這邊是預設送給管理者，用在訂單時再抓對方sid跟哪方送出
      `{"msg":"${msg.value.trim()}","receive_sid":101,"receive_side":4}`
    );
    //清空輸入欄
    msg.value = "";
  }
}
