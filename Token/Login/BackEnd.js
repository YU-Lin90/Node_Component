//登入--後端
//註解只有會員，其他以此類推
const express = require("express");
const router = express.Router();
const DB = require("../Modules/ConnectDataBase");
const jwt = require("jsonwebtoken");
//===============================================分隔線================================================
//會員
router.use("/Member", async (req, res) => {
  const output = {
    errorType: "",
    success: false,
    token: null,
  };
  //傳進來的資料
  const datas = req.body;

  const email = datas.email.trim();
  const password = datas.password.trim();
  //後段再判斷一次 否則可能會有安全性問題
  if (!email || !password) {
    output.errorType = "帳號或密碼錯誤";
    return res.json(output);
  }
  const loginSql =
    "SELECT `sid`, `name`, `email`, `password` FROM `member` WHERE `email` LIKE ? ";

  let [[result]] = await DB.query(loginSql, [email]);
  let passStat = false;
  //檢查密碼
  result.password === password ? (passStat = true) : null;
  // console.log(result);
  //沒有相應的帳號
  if (!result) {
    output.errorType = "帳號或密碼錯誤";
    return res.json(output);
  }
  //密碼錯誤
  else if (!passStat) {
    output.errorType = "帳號或密碼錯誤";
    return res.json(output);
  }
  //正確
  else {
    output.success = true;
    //寫入token並加密
    const signToken = jwt.sign(
      {
        sid: result.sid,
        email: result.email,
        name: result.name,
      },
      process.env.JWT_SECRET
    );
    //掛在output回傳
    output.token = signToken;

    return res.json(output);
  }
});
//===============================================分隔線================================================
//店家+管理員
router.use("/Store", async (req, res) => {
  const output = {
    errorType: "",
    success: false,
    token: null,
  };

  const datas = req.body;

  const email = datas.email;
  const password = datas.password;

  if (!email || !password) {
    output.errorType = "帳號或密碼錯誤";
    return res.json(output);
  }
  const loginSql =
    "SELECT `sid`, `name`, `email`, `password` FROM `shop` WHERE `email` = ? ";

  let [[result]] = await DB.query(loginSql, [email]);

  if (!result) {
    output.errorType = "帳號或密碼錯誤";
    return res.json(output);
  }
  let passStat = false;
  result.password === password ? (passStat = true) : null;
  if (!passStat) {
    output.errorType = "帳號或密碼錯誤";
    return res.json(output);
  } else if (result.sid === 101) {
    output.success = true;
    const signToken = jwt.sign(
      {
        sid: result.sid,
        email: result.email,
        name: result.name,
      },
      process.env.JWT_SECRET
    );
    output.token = signToken;
    output.adminToken = signToken;
    return res.json(output);
  } else {
    output.success = true;
    const signToken = jwt.sign(
      {
        sid: result.sid,
        email: result.email,
        name: result.name,
      },
      process.env.JWT_SECRET
    );
    output.token = signToken;

    return res.json(output);
  }
});
//===============================================分隔線================================================
//外送員
router.use("/Deliver", async (req, res) => {
  const output = {
    errorType: "",
    success: false,
    token: null,
  };

  const datas = req.body;

  const email = datas.email;
  const password = datas.password;

  if (!email || !password) {
    output.errorType = "帳號或密碼錯誤";
    return res.json(output);
  }
  const loginSql = "SELECT * FROM `deliver` WHERE `email` = ? ";

  let [[result]] = await DB.query(loginSql, [email]);

  if (!result) {
    output.errorType = "帳號或密碼錯誤";
    return res.json(output);
  }
  let passStat = false;
  result.password === password ? (passStat = true) : null;
  if (!passStat) {
    output.errorType = "帳號或密碼錯誤";
    return res.json(output);
  } else {
    output.success = true;
    const signToken = jwt.sign(
      {
        sid: result.sid,
        email: result.email,
        name: result.name,
      },
      process.env.JWT_SECRET
    );
    output.token = signToken;
    return res.json(output);
  }
});
//===============================================分隔線================================================

module.exports = router;
