const DEBUG_MODE = false;
// 是否顯示console.log, 值: true or false
// 例:
// DEBUG_MODE && console.log("errer");

const wsUri_chat = "wss://cht.ws.kingkong.com.tw/chat_nsp/?EIO=3&transport=websocket"; //chat server

const wsUri_gift_2 = "wss://ctl-2.ws.kingkong.com.tw/control_nsp/?EIO=3&transport=websocket"; //gift server
const wsUri_gift_1 = "wss://ctl-1.ws.kingkong.com.tw/control_nsp/?EIO=3&transport=websocket"; //館長台
var wsUri_gift;

var output; //聊天室輸出 div#output
var heat; //熱度 div#heat
var ping; // 保持websocket連線,PING-PONG
var ping2; // 保持websocket連線,PING-PONG
var chat_i = 0; //計算聊天室的行數
var tokens = []; //連線資訊
var stop_scroll = false; //上拉時防止捲動

function init(){
  // 當 hashtag 改變時重新載入頁面
  window.addEventListener("hashchange", function(){
    location.reload();
  }, false);

  //判斷載入分頁
  if(window.location.hash == '' || window.location.hash == '#'){
    //載入首頁
    goto_home_page();
  }else{
    //載入聊天室頁面
    goto_chat_page();
  }
}

//載入首頁
function goto_home_page(){
  document.getElementById("c_script").style.display = 'block';

  change_channel_btn(); //改完後觸發hashchange重載頁面
}

//載入聊天室頁面
function goto_chat_page(){
  output = document.getElementById("output"); //聊天室輸出
  output.innerHTML = '';

  heat = document.getElementById("heat"); //熱度
  heat.innerHTML = '熱度: 0';

  scroll_to_bottom_btn(); //建立向下捲動按鈕
  get_token(); //取得token
}

function change_channel_btn(){
  let btn_submit = document.getElementById("btn_submit");
  btn_submit.addEventListener("mouseup", function(){
    DEBUG_MODE && console.log("onmouseup");
    DEBUG_MODE && console.log(document.getElementById("inputChannel").value);
    window.location.hash = `#${document.getElementById("inputChannel").value}`;
  });
}

//取得連線資訊
function get_token(){
  let get_hashtag = window.location.hash;
  let get_tokeh_url;

  if(window.location.hash !== ''){
    //let get_hashtag_num = get_hashtag.replace(/[^0-9]/g,'');
    let get_hashtag_num = htmlEncode(get_hashtag.substr(1));

    get_tokeh_url = `get_token.php?u=${get_hashtag_num}`;

    $.ajax({
      type: 'GET',
      url: get_tokeh_url,
      dataType: 'json',
      success: function(data) {
        //DEBUG_MODE && console.log(data.data);

        if(data!=undefined && data.data!=undefined){
          //連線資料
          tokens['token'] = data.data[0].token;
          tokens['live_id'] = data.data[0].room.live_id;
          tokens['room_id'] = data.data[0].room.room_id; //禮物效果用

          //其他資料
          tokens['nickname'] = htmlEncode(data.data[0].room.nickname);
          tokens['room_title'] = htmlEncode(data.data[0].room.room_title);

          document.getElementById("announcements").style.display = 'none';

          //document.title = `[${tokens['nickname']}] ${tokens['room_title']} - BABANANA Chat`;

          writeToScreen(`歡迎來到 ${tokens['nickname']} 的實況台`);
          writeToScreen(`實況標題: ${tokens['room_title']}`);

          //館長台
          if(get_hashtag_num == "2282757"){
            wsUri_gift = wsUri_gift_1;
          }else{
            wsUri_gift = wsUri_gift_2;
          }

          //連接聊天室伺服器
          testWebSocket();

          //連接禮物伺服器
          testWebSocket_gift();
        }else{
          writeToScreen(`
            [錯誤]找不到指定的聊天室!<br>
            回到 <a href="./">[首頁]</a>
          `);
        }
      },
      error: function() {
        DEBUG_MODE && console.log("errer");
      },
      complete: function(){
        //DEBUG_MODE && console.log("test");
      }
    });
  }else{
    //get_tokeh_url = `get_token.php`;

    /*
    writeToScreen(`
      <div class="announcements">
        這個頁面是金剛直播聊天室的"非官方"連線工具，<br>
        本站和金剛直播(www.kingkong.com.tw)無任何關係。<br>
        說明文件請到: <a href="https://hackmd.io/s/B183d6iwG" rel="noopener noreferrer" target="_blank">https://hackmd.io/s/B183d6iwG</a><br><br>
        <div>
          輸入你的實況台編號: <br>
          <input id="inputChannel" type="textbox" name="c" placeholder="例如： 2426076">
          <button id="btn_submit">送出</button>
        </div>
      </div>
    `);
    */


  }
}

//聊天室
var ws_chat = {
  onOpen: function(evt){
    //DEBUG_MODE && console.log(evt);
    writeToScreen(`<div class="kk_chat">[成功連接聊天室伺服器]</div>`);
  },
  onClose: function(evt){
    writeToScreen(`<div class="kk_chat">[與伺服器斷線]</div>`);
  },
  onMessage: function(evt){
    DEBUG_MODE && console.log(evt.data);

    let chat_string = evt.data.trim();

    if(chat_string.substr(0,2) == "0{") {
      this.doSend(`40/chat_nsp,`);
    }

    if(chat_string == "40/chat_nsp"){
      //doSend(`42/chat_nsp,["authentication",{"live_id":"2282757G26945GPLo","token":"這裡是token","client_type":"web"}]`);

      this.doSend(`42/chat_nsp,["authentication",{"live_id":"${tokens['live_id']}","token":"${tokens['token']}","client_type":"web"}]`);
    }

    let self = this;
    if(chat_string == `42/chat_nsp,["authenticated",true]`){
      ping = setTimeout(function(){
        self.doSend("2");
      },50000);

      writeToScreen(`<div class="kk_chat">[成功進入聊天室]</div>`);
    }
    if(chat_string == "3") {
      clearTimeout(ping);
      ping = setTimeout(function(){
        self.doSend("2");
      },50000);
    }

    if(chat_string.substr(0,11) == "42/chat_nsp"){
      let json_txt = chat_string.substr(12);
      let json_decode = JSON.parse(json_txt);
      DEBUG_MODE && console.log(json_decode);
      let w_name;

      switch(json_decode[0]){
        case "msg":
          w_name = htmlEncode(json_decode[1].name);
          let msg = htmlEncode(json_decode[1].msg);
          let grade_lvl = json_decode[1].grade_lvl;
          let rel_color = json_decode[1].rel_color;
          let color_css = rel_color?("color:"+rel_color+";"):"";

          DEBUG_MODE && console.log(`${w_name} : ${msg}`);

          writeToScreen(`
            <div class="kk_chat">
              <span class="isadmin">${((w_name==tokens['nickname'])?"[主播] ":"")}</span>
              <!--<span class="grade_lvl">[${grade_lvl}]</span>-->
              <span class="name" style="${color_css}">${w_name}</span>
              <span class="msg">: ${msg}</span>
            </div>
          `);
          break;
        case "join":
          w_name = htmlEncode(json_decode[1].name);
          DEBUG_MODE && console.log(`[ ${w_name} ] 進入聊天室`);
          writeToScreen(`
            <div class="kk_come">
              [ ${w_name} ] 進入聊天室
            </div>
          `);
          break;
      }
    }
  },
  onError: function(evt){
    writeToScreen('<span style="color: red;">[ERROR]:</span> ' + htmlEncode(evt.data));
  },
  doSend: function(message){
    websocket.send(message);
  },
};

//聊天室
function testWebSocket(){
  websocket = new WebSocket(wsUri_chat);

  //websocket的事件監聽器
  websocket.onopen = function(evt) { ws_chat.onOpen(evt) };
  websocket.onclose = function(evt) { ws_chat.onClose(evt) };
  websocket.onmessage = function(evt) { ws_chat.onMessage(evt) };
  websocket.onerror = function(evt) { ws_chat.onError(evt) };
}


//禮物效果
var ws_gift = {
  onOpen: function(evt){
    writeToScreen(`<div class="kk_gift">[成功連接禮物伺服器]</div>`);
    //DEBUG_MODE && console.log(evt);
    heat.style.display = 'block'; //開啟熱度欄
  },
  onClose: function(evt){
    writeToScreen(`<div class="kk_gift">[與禮物伺服器斷線]</div>`);
  },
  onMessage: function(evt){
    DEBUG_MODE && console.log(evt.data);

    let chat_string = evt.data.trim();

    if(chat_string.substr(0,2) == "0{") {
      this.doSend(`40/control_nsp,`);
    }

    if(chat_string == "40/control_nsp"){
      //doSend(`42/control_nsp,["authentication",{"live_id":"2152350G64995LSG4","anchor_pfid":2152350,"token":"這裡是token","client_type":"web"}]`);

      this.doSend(`42/control_nsp,["authentication",{"live_id":"${tokens['live_id']}","anchor_pfid":${tokens['room_id']},"token":"${tokens['token']}","client_type":"web"}]`);
    }

    let self = this;
    if(chat_string == `42/control_nsp,["authenticated",true]`){
      ping2 = setTimeout(function(){
        self.doSend("2");
      },50000);

      writeToScreen(`<div class="kk_gift">[成功進入禮物伺服器]</div>`);
    }
    if(chat_string == "3") {
      clearTimeout(ping2);
      ping2 = setTimeout(function(){
        self.doSend("2");
      },50000);
    }

    if(chat_string.substr(0,14) == "42/control_nsp"){
      let json_txt = chat_string.substr(15);
      let json_decode = JSON.parse(json_txt);
      DEBUG_MODE && console.log(json_decode);
      //console.log(json_decode[0]);
      let w_name;

      switch(json_decode[0]){
        case "site_customize":
          DEBUG_MODE && console.log(json_decode[1]);
          /*
            42/control_nsp,
            [
              "site_customize",
              {
                "data":
                {
                  "duration":20,
                  "icon":"http://blob.ufile.ucloud.com.cn/c6da5179d94ba255aea5e524ad9b562a",
                  "send_nickname":"🎹🎺PonPon🎰",
                  "gift_name":"旺旺鞭炮",
                  "award_times":500,
                  "award_amout":1500,
                  "live_info":null,
                  "filter":{"noti_flag":3},
                  "Event":"notify_gift_crit"
                },
                "at":1519369750593
              }
            ]
          */

          let send_nickname = json_decode[1].data.send_nickname;
          let gift_name = json_decode[1].data.send_gift_name;
          let award_times = json_decode[1].data.award_times;
          //let msg = htmlEncode(json_decode[1].msg);
          //let grade_lvl = json_decode[1].grade_lvl;
          //let rel_color = json_decode[1].rel_color;
          //let color_css = rel_color?("color:"+rel_color+";"):"";

          //DEBUG_MODE && console.log(`${w_name} : ${msg}`);

          //w_name = json_decode[1];
          /*
          writeToScreen(`
            <div class="kk_gift">
              <span>${send_nickname} 送出 ${award_times}個 [${gift_name}]</span>
            </div>
          `);
          */
          break;
        case "site_customize":


          break;
        case "room_broadcast":
          /*
            42/control_nsp,
            ["room_broadcast",{
              "type":1,"content":{"fe_name":"西門","fe_id":2152350,"fr_name":"未央派","fr_id":2204294,"fr_lv":15,"fr_grade_id":1,"fr_grade_lvl":31},"at":1519369770728
            }]
          */

          //console.log(`${json_decode[1]}`);

          //追蹤
          if(json_decode[1].type == 1){
            //console.log(`${json_decode[1].content.fr_name} 追蹤了主播`);
            writeToScreen(`
              <div class="kk_gift">
                <span>${json_decode[1].content.fr_name} 追蹤了主播</span>
              </div>
            `);
          }


          break;
        case "room_customize":
          /*
            42/control_nsp,
            ["room_customize",{
              "data":{"delta":-846,"heat":168294,"Event":"live_heat","at":1519369752448},"at":1519369752448
            }]
          */

          //console.log(json_decode[1]);

          //熱度:
          if(json_decode[1].data.Event == "live_heat"){
            //console.log(json_decode[1].data.heat);
            heat.innerHTML = `熱度: ${numberWithCommas(json_decode[1].data.heat)}`;

            break;
          }

          /*
            42/control_nsp,
            ["room_customize",{
              "data":{"icon":[{"index":60,"line_1":"TOP100+","line_2":"福氣值:713","now_icon":""}],"Event":"live_icon_dynamic","at":1519369775403},"at":1519369775403
            }]
          */

          /*
            42/control_nsp,
            [
              "room_customize",
              {
                "data":{
                  "live_id":"2152350G64995LSG4",
                  "f_pfid":2426076,
                  "f_nickname":"EOTONES",
                  "f_headimg":"http://blob.ufile.ucloud.com.cn/2f3713397e7df78ad17b4f163459b25a",
                  "f_lvl":6,
                  "prod_id":1335,
                  "prod_cnt":"1",
                  "prod_total":2,
                  "display":"1",
                  "prod_clickid":"1519373595671",
                  "prod_combo":1,
                  "prod_giftnum":"1",
                  "anchor_diamond":"820284",
                  "anchor_diamond_day":"3335",
                  "combo_final":0,
                  "vip_fan":0,
                  "grade_id":1,
                  "grade_lvl":13,
                  "Event":"gift_send",
                  "at":1519373610626
                },
                "at":1519373610626
              }
            ]
          */

          let prod_id_arr = [];

          prod_id_arr[1002] = "大紅包";
          prod_id_arr[1159] = "火箭";

          prod_id_arr[1313] = "MVP";

          prod_id_arr[1334] = "94狂";
          prod_id_arr[1335] = "掌聲鼓勵";
          prod_id_arr[1336] = "很廢";
          prod_id_arr[1337] = "好棒棒";
          prod_id_arr[1339] = "能量飲料";

          prod_id_arr[1341] = "平底鍋";
          prod_id_arr[1342] = "灰機";

          prod_id_arr[1362] = "歡樂送";
          prod_id_arr[1364] = "大雞大利";
          prod_id_arr[1365] = "香蕉";

          prod_id_arr[1372] = "天使甲";
          prod_id_arr[1373] = "小金人";

          prod_id_arr[1393] = "LMS徽章";


          if(json_decode[1].data.f_nickname != null && json_decode[1].data.prod_id != null && json_decode[1].data.prod_id >= 1000 && json_decode[1].data.prod_id != 1059 && json_decode[1].data.prod_id != 1077 && json_decode[1].data.prod_id <= 4000){
            let f_nickname = json_decode[1].data.f_nickname;
            let prod_cnt = json_decode[1].data.prod_cnt;
            let prod_total = json_decode[1].data.prod_total;
            let prod_id = json_decode[1].data.prod_id;
            //let msg = htmlEncode(json_decode[1].msg);
            //let grade_lvl = json_decode[1].grade_lvl;
            //let rel_color = json_decode[1].rel_color;
            //let color_css = rel_color?("color:"+rel_color+";"):"";

            //DEBUG_MODE && console.log(`${w_name} : ${msg}`);

            //w_name = json_decode[1];

            if(typeof prod_id_arr[prod_id] != 'undefined'){
              writeToScreen(`
                <div class="kk_gift">
                  <span>${f_nickname} 送出 ${prod_cnt}個 [${prod_id_arr[prod_id]}]</span>
                </div>
              `);
            }

          }
          break;
      }
    }
  },
  onError: function(evt){
    writeToScreen('<span style="color: red;">[ERROR]:</span> ' + htmlEncode(evt.data));
  },
  doSend: function(message){
    websocket_gift.send(message);
  },
};

//禮物效果
function testWebSocket_gift(){
  websocket_gift = new WebSocket(wsUri_gift);

  //websocket的事件監聽器
  websocket_gift.onopen = function(evt) { ws_gift.onOpen(evt) };
  websocket_gift.onclose = function(evt) { ws_gift.onClose(evt) };
  websocket_gift.onmessage = function(evt) { ws_gift.onMessage(evt) };
  websocket_gift.onerror = function(evt) { ws_gift.onError(evt) };
}



function writeToScreen(message){
  //避免訊息過多瀏覽器當掉,超過1000則訊息時清空畫面
  if(chat_i > 1000){
    output.innerHTML = "";
    console.clear();
    chat_i = 0;
  }

  let pre = document.createElement("div");
  pre.style.wordWrap = "break-word";


  //pre.innerHTML = message.replace(/\n/g, "<br />"); // 將"\n"轉換成"<br />"
  pre.innerHTML = message;

  output.appendChild(pre); //輸出訊息在畫面上

  scroll_to_bottom_auto();

  chat_i++; //目前頁面訊息數
}

function htmlEncode(html_c){
  return html_c.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function numberWithCommas(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function scroll_to_bottom_auto(){

  if(stop_scroll == false){
    window.scrollTo(0,document.body.scrollHeight); //畫面自動捲動
  }else{
    //document.getElementById("scroll_to_bottom_btn").style.display = 'block';
  }
}

//向下捲動的按鈕
function scroll_to_bottom_btn(){
  let scroll_to_bottom_btn = document.getElementById("scroll_to_bottom_btn");
  scroll_to_bottom_btn.addEventListener("mouseup", function(){
    window.scrollTo(0,document.body.scrollHeight);
    document.getElementById("scroll_to_bottom_btn").style.display = 'none';
    stop_scroll = false;
  });
}

var lastScrollTop = 0;

//自動判決定是否顯示向下捲動的按鈕
if(obs_mode != true){
  window.addEventListener("scroll", function(){
    //console.log("on scroll");
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop){
      // downscroll code
      //console.log("down scroll");
    } else {
      // upscroll code
      //console.log("up scroll");
      stop_scroll = true;
      document.getElementById("scroll_to_bottom_btn").style.display = 'block';
    }
    lastScrollTop = st;
  }, false);
}

(function(){
  //程式進入點
  window.addEventListener("load", init, false);
})();
