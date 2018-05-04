const io = require('socket.io-client');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const infoTool = require("./info");
const config = require("./config.json")

// https://www.kingkong.com.tw/2150439

const MongoClient = require('mongodb').MongoClient;

let socket = {};
let roomInfo = {};
let jwtToken = "" ;
let langID = process.argv[2] ? process.argv[2] : "2150439" ;
let db ;
let dbo ;
let is_live = 0 ;

// const uri = "mongodb://localhost:27017" ;

MongoClient.connect(config.mongodbUri, function(err, _db) {
  if(err) {console.error(err)}
  else{
    //Write databse Insert/Update/Query code here..
    db = _db ;
    // console.log("db", db) ;
    console.log('mongodb is running!');
    dbo = db.db("kingkong");
    dbo.collection("test").insertOne({"dt":new Date()}, function(err, res) {
      if (err) throw err;
      console.log("1 test document inserted");
      run();
    });
  }
});

async function run(){
  await prepareSocketConnInfo();
  initSocket();

  setInterval(async function(){
    await prepareSocketConnInfo() ;
    if ( !(roomInfo.data.live_status == is_live) ){
      destorySocket(initSocket);
    }
  }, 30*1000);
}

async function prepareSocketConnInfo(){
  roomInfo = await infoTool.getRoomInfo(langID);
  is_live = roomInfo.data.live_status ;
  console.log("is_live",is_live);
  let jwtPayload = setPayload(roomInfo.data.live_id) ;
  jwtToken = jwt.sign(jwtPayload, roomInfo.data.live_key, { algorithm: 'HS256', noTimestamp: true}) ;
}

function setPayload(live_id){
  let payload = {};
  payload.channel_id = 1 ;
  payload.client_type = "web" ;
  payload.from = 1 ;
  payload.from_seq = 1 ;
  payload.live_id = live_id;
  payload.lv = 1 ;
  payload.pfid = genPFID();
  payload.name = "訪客"+ payload.pfid.substring(payload.pfid.length - 5, payload.pfid.length);
  return payload ;
}

function genPFID(){
  return uuidv4().replace(/\-/g, "");
}

function initSocket(){
  socket = io( "wss://cht.ws.kingkong.com.tw/chat_nsp", {path:"/chat_nsp", transports: ['websocket']} );
  socket.on('connect', function(){
    console.log("connect",socket.id);
    let authObj = {
        live_id: roomInfo.liveId,
        anchor_pfid: roomInfo.anchorId,
        token: jwtToken,
        client_type: "web"
    }
    console.log("authObj",authObj);
    socket.emit("authentication", authObj);
  });

  socket.on('authenticated', function(data){
    console.log("authenticated: ",data);
  });

  socket.on('unauthorized', function(data){
    console.log("unauthorized: ",data);
  });
  socket.on('msg', function(data) {
    dbo.collection('chat', function(err, collection) {
      if (err){
        console.error(err);
      }else {
        collection.insert(data);
      }

    });
    // console.log("msg raw:",data);
    console.log("msg: ",(data.is_admin ? "管理" :"") ,(data.name + ": " + data.msg) );
  });
  socket.on('join', function(data){
    dbo.collection('join', function(err, collection) {
      if (err){
        console.error(err);
      }else {
        collection.insert(data);
      }

    });
    // console.log("join raw:",data);
    // console.log("join: ",(data.new_user ? "new " :"") ,data.name);
  });
  socket.on('admin', function(data){
    // console.log("admin raw:",data);
    // console.log("admin: ",data);
  });

  socket.on('disconnect', function(){
    console.log("disconnect");
  });
  socket.on('pong', (latency) => {
    // console.log("pong",latency);
  });
  socket.on('ping', () => {
    // console.log("ping");
  });
}

function destorySocket(cb){
  socket.off(); // remove all ev
  socket.on('disconnect',cb);
  // add new disconnect to ensure closed and init new socket
  socket.close();
  socket.off('disconnect',cb);
  // remove previous disconnect ev

}
