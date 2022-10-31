//登入--前端
const chooseWhoString = [0, 'Member', 'Store', 'Deliver', 'Admin']
//登入函式   傳入要登入哪個帳號  帳號 密碼
function login(who, email, password) {
  //如果其中一樣是空的就不執行
  if (!email.trim() || !password.trim() || !who) {
    alert('輸入欄不可為空')
    return
  } else {
    //傳送資料
    const postData = JSON.stringify({
      //這邊變數要自己設定
      email: email,
      password: password,
    })
    //用陣列搜尋字串決定發POST到哪  單獨使用可以寫死
    //      這邊路由依照實際設定決定     寫死的時候函式不用傳who進來
    fetch('http://localhost:3001/Login/' + chooseWhoString[who], {
      method: 'POST',
      //跨域請求
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: postData,
    })
      .then((r) => r.json())
      .then((res) => {
        console.log({ res })
        if (res.success) {
          //有回傳成功則存到本機儲存空間
          //單獨使用一樣可以寫死
          localStorage.setItem(chooseWhoString[who], res.token)
          //如果有登入管理者
          if (res.adminToken) {
            localStorage.setItem(chooseWhoString[4], res.adminToken)
            alert(chooseWhoString[4] + '登入成功')
          } else {
            alert(chooseWhoString[who] + '登入成功')
          }
        } else {
          alert(res.errorType)
        }
        // localStorage.setItem('auth', 'Bearer ' + res)
        // console.log('FE', localStorage.getItem())
      })
  }
}