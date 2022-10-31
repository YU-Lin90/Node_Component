//index.js路由中介設定
//Token Check
//==============================================分隔線================================================
//====※※※※※============※========================================================================
//========※================※=======※※※※=========================================================
//========※=====※※※※===※==※===※====※===※※※================================================
//========※=====※====※===※※=====※※※※===※====※==============================================
//========※=====※====※===※※=====※=========※====※==============================================
//========※=====※※※※===※==※===※※※※===※====※==============================================
//===============================================分隔線==============================================
//Token版  登入檢查程式 前端要送Token到後端
//使用方式  路徑              中介函式                    API路由
//app.use("/MemberPointApi", memberTokenLoginCheck, require("./Api/Member/Member_PointApi"));
//確認完之後直接把資訊放在  req.token往下傳
//在API路由內的req.token 可以拿到登入SID資訊等等
//其他GET、POST 等等的資料不會動到
//===============================================分隔線================================================
//基礎插件
const DB = require(__dirname + "/modules/ConnectDataBase");
const jwt = require("jsonwebtoken");
//會員
const memberTokenLoginCheck = async (req, res, next) => {
  //token字串切割
  const tokenGet = req.header("Authorization").replace("Bearer ", "");
  //因為前面有加Bearer所以null會變文字
  //tokenGet也要判斷，因為不經果前端post進來也有可能有錯誤
  if (tokenGet === "null"||!tokenGet) {
    return res.json(0);
  } else {
    //token字串解譯
    const parsedToken = jwt.verify(tokenGet, process.env.JWT_SECRET);
    const loginSql =
      "SELECT `sid`, `name`, `email` FROM `member` WHERE `email` = ? AND `name` = ? AND `sid` = ?";
    //確認解譯後資訊是否存在
    const { email, sid, name } = parsedToken;
    const [[result]] = await DB.query(loginSql, [email, name, sid]);
    if (!result) {
      //沒有資料就阻擋
      return res.json(0);
    } else {
      //有資料就傳進下一個路由處理
      //這邊加掛side 給WebSocket用
      parsedToken.side = 1
      req.token = parsedToken
      next();
    }
  }
};
//店家
const storeTokenLoginCheck = async (req, res, next) => {
  const tokenGet = req.header("Authorization").replace("Bearer ", "");
  if (tokenGet === "null") {
    return res.json(0);
  } else {
    const parsedToken = jwt.verify(tokenGet, process.env.JWT_SECRET);
    const loginSql =
      "SELECT `sid`, `name`, `email` FROM `shop` WHERE `email` = ? AND `name` = ? AND `sid` = ?";
    const { email, sid, name } = parsedToken;
    const [[result]] = await DB.query(loginSql, [email, name, sid]);
    if (!result) {
      return res.json(0);
    } else {
      parsedToken.side = 2
      req.token = parsedToken
      next();
    }
  }
};
//外送員
const deliverTokenLoginCheck = async (req, res, next) => {
  const tokenGet = req.header("Authorization").replace("Bearer ", "");
  if (tokenGet === "null") {
    return res.json(0);
  } else {
    const loginSql =
      "SELECT `sid`, `name`, `email` FROM `deliver` WHERE `email` = ? AND `name` = ? AND `sid` = ?";
    const { email, sid, name } = parsedToken;
    const [[result]] = await DB.query(loginSql, [email, name, sid]);
    if (!result) {
      return res.json(0);
    } else {
      parsedToken.side = 3
      req.token = parsedToken
      next();
    }

  }
};
//管理員
const adminTokenLoginCheck = async (req, res, next) => {
  const tokenGet = req.header("Authorization").replace("Bearer ", "");
  if (tokenGet === "null") {
    return res.json(0);
  } else {
    const loginSql =
      "SELECT `sid`, `name`, `email` FROM `shop` WHERE `email` = ? AND `name` = ? AND `sid` = ?";
    const { email, sid, name } = parsedToken;
    //不是101直接擋掉
    if (sid !== 101) {
      return res.json(0);
    }
    const [[result]] = await DB.query(loginSql, [email, name, sid]);
    if (!result) {
      return res.json(0);
    } else {
      parsedToken.side = 4
      req.token = parsedToken
      next();
    }
  }
};
