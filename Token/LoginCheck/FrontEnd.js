const chooseWhoString = [0, 'Member', 'Store', 'Deliver', 'Admin']
//檢查登入 傳入要檢查誰 單獨使用可以寫死後不用傳值
function fetchLoginCheck(who) {
  if (!!who) {//這行判斷式如果寫死可以拿掉
    fetch('http://localhost:3001/LoginCheck/' + chooseWhoString[who], {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        mode: 'cors',
        //從本機儲存空間拿出資料掛在HEADER傳到後端
        Authorization: 'Bearer ' + localStorage.getItem(chooseWhoString[who]),
      },
    })
      .then((r) => r.json())
      .then((res) => {
        console.log({ res })
        if (res === 0) {
          alert('未登入')
        } else {
          //這裡再放拿到資料要做什麼
        }
        //收到1代表有登入
        //收到0代表沒登入
      })
  } else {
    alert('未選擇')
    return
  }
}