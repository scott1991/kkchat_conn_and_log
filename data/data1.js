{
  channel_id: 1
  client_type: "web"
  from: 1
  from_seq: 1
  live_id: "2165104G90002R09c"
  lv: 1
  name: "訪客b0ef1"
  pfid: "414de62302a94fc5a024bf14e83b0ef1"
}

{
  "use strict";

  function n(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function")
  }
  var a = function() {
      function e(e, t) {
        for (var i = 0; i < t.length; i++) {
          var n = t[i];
          n.enumerable = n.enumerable || !1,
            n.configurable = !0,
            "value" in n && (n.writable = !0),
            Object.defineProperty(e, n.key, n)
        }
      }
      return function(t, i, n) {
        return i && e(t.prototype, i),
          n && e(t, n),
          t
      }
    }(),
    o = function() {
      function e(t) {
        var i = t.liveId,
          a = t.liveKey,
          o = t.admin,
          s = t.relColor,
          r = t.pfid,
          l = t.name,
          c = t.gradeId,
          u = t.gradeLv,
          f = t.lv,
          d = t.from,
          h = t.fromSeq,
          g = t.channelId,
          m = t.anchor,
          p = t.follow,
          v = t.sex,
          y = t.balance,
          _ = t.sun,
          k = t.mute,
          w = t.relation,
          b = t.avatar,
          T = t.signed;
        n(this, e),
          this.liveId = i,
          this.liveKey = a,
          this.pfid = r || this._getPFID(),
          this.name = l || this._getName(this.pfid),
          this.relColor = s || "#ffffff",
          this.gradeId = c || 1,
          this.gradeLv = u || 1,
          this.lv = f || 1,
          this.from = d || 1,
          this.fromSeq = h || 1,
          this.channelId = g || 1,
          this.anchor = m || !1,
          this.admin = o || !1,
          this.follow = p || 0,
          this.sex = v || 0,
          this.balance = y || 0,
          this.sun = _ || 0,
          this.mute = k || 0,
          this.relation = w,
          this.avatar = b || 0,
          this.signed = T,
          this.token = this.getToken()
      }
      return a(e, [{
          key: "_getPFID",
          value: function() {
            var e = UUID.generate().toString().replace(/\-/g, "");
            return e = e.substring(0, e.length)
          }
        }, {
          key: "_getName",
          value: function(e) {
            var t;
            return e && (t = "訪客" + e.toString().substring(e.length - 5, e.length)),
              t
          }
        }, {
          key: "getToken",
          value: function() {
            function e(e) {
              var t = CryptoJS.enc.Base64.stringify(e);
              return t = t.replace(/=+$/, ""),
                t = t.replace(/\+/g, "-"),
                t = t.replace(/\//g, "_")
            }
            var t = {};
            t.live_id = this.liveId,
              t.pfid = this.pfid,
              t.name = this.name,
              t.lv = this.lv,
              t.from = this.from,
              t.from_seq = this.fromSeq,
              t.channel_id = this.channelId,
              t.client_type = "web";
            var i = {
                alg: "HS256",
                typ: "JWT"
              },
              n = CryptoJS.enc.Utf8.parse(JSON.stringify(i)),
              a = e(n),
              o = CryptoJS.enc.Utf8.parse(JSON.stringify(t)),
              s = e(o),
              r = a + "." + s,
              l = this.liveKey,
              c = CryptoJS.HmacSHA256(r, l);
            return c = e(c),
              r + "." + c
          }
        }]),
        e
    }();
  t.exports = o
}


{
  "use strict";

  function n(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function")
  }
  var o = function() {
      function e(e, t) {
        for (var i = 0; i < t.length; i++) {
          var n = t[i];
          n.enumerable = n.enumerable || !1,
            n.configurable = !0,
            "value" in n && (n.writable = !0),
            Object.defineProperty(e, n.key, n)
        }
      }
      return function(t, i, n) {
        return i && e(t.prototype, i),
          n && e(t, n),
          t
      }
    }(),
    a = e("./Logger"),
    s = function(e) {
      return e && e.__esModule ? e : {
        default: e
      }
    }(a);
  window.SOCKETEVENT = {
    authentication: "authentication",
    authenticated: "authenticated",
    unauthorized: "unauthorized",
    msg: "msg",
    item: "item",
    gift_send: "gift_send",
    join: "join",
    grade_lvl_up: "grade_lvl_up",
    live_heat: "live_heat",
    site_broadcast: "site_broadcast",
    site_customize: "site_customize",
    person_customize: "person_customize",
    grade_levelup_notify: "grade_levelup_notify",
    relation_update: "relation_update",
    admin_msg: "admin_msg",
    admin: "admin",
    set_admin: "set_admin",
    cancel_admin: "cancel_admin",
    close: "close",
    room_broadcast: "room_broadcast",
    room_customize: "room_customize",
    room_status: "room_status",
    system_notice: "system_notice",
    system_warning: "system_warning",
    switch_chat_room: "switch_chat_room",
    redpacket_create: "redpacket_create",
    web_redpacket_receive: "web_redpacket_receive",
    packet_delay_list: "packet_delay_list",
    super_bullet: "super_bullet"
  };
  var r = function() {
    function e(t) {
      var i = t.url,
        o = t.type,
        a = t.liveId,
        s = t.anchorId,
        r = t.token,
        l = t.path,
        c = t.onMsg,
        u = t.onJoin,
        d = t.onFollow,
        f = t.onStat,
        h = t.onGift,
        g = t.onLvUp,
        m = t.onSetAdmin,
        p = t.onLvUpNotify,
        v = t.onSystemNotice,
        y = t.onMute,
        _ = t.onLiveHeat,
        k = t.onCancelAdmin,
        w = t.onSystemWarning,
        b = t.onSwitchChatRoom,
        T = t.onConnected,
        S = t.onDisConnected,
        $ = t.onRelationUpdate,
        I = t.onClose,
        C = t.onRedPacketCreate,
        E = t.onRedPacketReceive,
        x = t.onRedPacketList,
        M = t.onSupperBullet;
      return n(this, e),
        this.type = o,
        this.url = i,
        this.socket = null,
        this.liveId = a,
        this.anchorId = s,
        this.token = r,
        this.path = l,
        this.connected = !1,
        this.onMsg = c,
        this.onJoin = u,
        this.onFollow = d,
        this.onStat = f,
        this.onGift = h,
        this.onLvUp = g,
        this.onSetAdmin = m,
        this.onLvUpNotify = p,
        this.onSystemNotice = v,
        this.onMute = y,
        this.onLiveHeat = _,
        this.onCancelAdmin = k,
        this.onSystemWarning = w,
        this.onSwitchChatRoom = b,
        this.onClose = I,
        this.onRelationUpdate = $,
        this.onConnected = T,
        this.onDisConnected = S,
        this.onRedPacketCreate = C,
        this.onRedPacketReceive = E,
        this.onRedPacketList = x,
        this.onSupperBullet = M,
        this._initSocket(),
        this.socket
    }
    return o(e, [{
        key: "_initSocket",
        value: function() {
          var e = this;
          return this.socket = io(this.url, {
              path: this.path,
              transports: ["websocket"]
            }),
            this.socket.on("connect", function(t) {
              s.default.v(e.type + " connected"),
                e.socket.emit(SOCKETEVENT.authentication, {
                  live_id: e.liveId,
                  anchor_pfid: e.anchorId,
                  token: e.token,
                  client_type: "web"
                })
            }),
            this.socket.on("disconnect", function() {
              s.default.v(e.type, " disconnected"),
                e.connected = !1,
                e.onDisConnected && e.onDisConnected()
            }),
            this.socket.on(SOCKETEVENT.authenticated, function(t) {
              e.connected = !0,
                e.onConnected && e.onConnected(),
                s.default.v(SOCKETEVENT.authenticated + ": " + e.type + " 登录成功。" + JSON.stringify(t))
            }),
            this.socket.on(SOCKETEVENT.unauthorized, function(t) {
              s.default.v(SOCKETEVENT.unauthorized + ": " + e.type + "登录失败。" + JSON.stringify(t)),
                e.connected = !1,
                e.onDisConnected && e.onDisConnected()
            }),
            this.socket.on(SOCKETEVENT.msg, function(t) {
              s.default.v(SOCKETEVENT.msg, t),
                e.onMsg && e.onMsg({
                  admin: t.is_admin,
                  pfid: t.pfid,
                  gradeId: t.grade_id,
                  gradeLv: t.grade_lvl,
                  relColor: t.rel_color,
                  lv: t.lvl,
                  name: t.name,
                  msg: t.msg
                })
            }),
            this.socket.on(SOCKETEVENT.join, function(t) {
              if (s.default.v(SOCKETEVENT.join, t),
                e.onJoin) {
                var i = {
                  admin: t.is_admin,
                  name: t.name,
                  pfid: t.pfid,
                  gradeId: t.grade_id,
                  gradeLv: t.grade_lvl
                };
                e.onJoin(i)
              }
            }),
            this.socket.on(SOCKETEVENT.admin, function(t) {
              s.default.v(SOCKETEVENT.admin, t),
                e.onMute && e.onMute(t)
            }),
            this.socket.on(SOCKETEVENT.room_broadcast, function(t) {
              if (s.default.v(SOCKETEVENT.room_broadcast, t),
                t && 1 == t.type && e.onFollow) {
                var i = {
                  admin: t.content.is_admin,
                  feName: t.content.fe_name,
                  feId: t.content.fe_id,
                  name: t.content.fr_name,
                  pfid: t.content.fr_id,
                  gradeId: t.content.fr_grade_id,
                  gradeLv: t.content.fr_grade_lvl,
                  lv: t.content.fr_lvl
                };
                e.onFollow(i)
              } else
                t && 2 == t.type && e.onStat && e.onStat(t)
            }),
            this.socket.on(SOCKETEVENT.system_notice, function(t) {
              s.default.v(SOCKETEVENT.system_notice, t),
                e.onSystemNotice && e.onSystemNotice(t)
            }),
            this.socket.on(SOCKETEVENT.person_customize, function(t) {
              s.default.v(SOCKETEVENT.person_customize, t),
                t.data && t.data.Event == SOCKETEVENT.grade_lvl_up && e.onLvUp ? e.onLvUp({
                  admin: t.data.is_admin,
                  gradeLv: t.data.grade_lvl,
                  gradeId: t.data.grade_id
                }) : t.data && t.data.Event == SOCKETEVENT.set_admin && e.onSetAdmin ? e.onSetAdmin({
                  pfid: t.data.pfid,
                  name: t.data.nickname,
                  title: t.data.title,
                  msg: t.data.msg,
                  gradeLv: t.data.grade_lvl,
                  gradeId: t.data.grade_id
                }) : t.data && t.data.Event == SOCKETEVENT.cancel_admin && e.onCancelAdmin ? e.onCancelAdmin({
                  pfid: t.data.pfid,
                  title: t.data.title,
                  msg: t.data.msg,
                  name: t.data.nickname
                }) : t.data && t.data.Event == SOCKETEVENT.system_warning && e.onSystemWarning ? e.onSystemWarning({
                  title: t.data.content
                }) : t.data && t.data.Event == SOCKETEVENT.relation_update && e.onRelationUpdate && e.onRelationUpdate({
                  pfid: t.data.pfid,
                  oPfid: t.data.o_pfid,
                  relColor: t.data.color
                })
            }),
            this.socket.on(SOCKETEVENT.room_customize, function(t) {
              if (s.default.v(SOCKETEVENT.room_customize, t),
                t.data && t.data.Event == SOCKETEVENT.gift_send && e.onGift && e.onGift(t.data),
                t.data && t.data.Event == SOCKETEVENT.grade_levelup_notify && e.onLvUpNotify && e.onLvUpNotify({
                  admin: t.is_admin,
                  msg: t.data.msg,
                  name: t.data.nickname,
                  pfid: t.data.pfid,
                  gradeLv: t.data.grade_lvl,
                  gradeId: t.data.grade_id,
                  at: t.data.at
                }),
                t.data && t.data.Event == SOCKETEVENT.live_heat && e.onLiveHeat && e.onLiveHeat({
                  liveId: t.data.live_id,
                  heat: t.data.heat,
                  delta: t.data.delta
                }),
                t.data && t.data.Event == SOCKETEVENT.switch_chat_room && e.onSwitchChatRoom && e.onSwitchChatRoom({
                  liveId: t.data.live_id,
                  liveKey: t.data.live_key,
                  status: t.data.status
                }),
                t.data && t.data.Event == SOCKETEVENT.redpacket_create && e.onRedPacketCreate) {
                if (0 == t.data.f_pfid)
                  return;
                e.onRedPacketCreate({
                  liveId: t.data.live_id,
                  pfid: t.data.f_pfid,
                  name: t.data.nickname,
                  avatar: t.data.headimg,
                  stamp: t.data.stamp,
                  prodId: t.data.prod_id,
                  distance1: t.data.distance_1,
                  distance_10: t.data.distance_10,
                  group: t.data.group,
                  gold: t.data.gold
                })
              }
              if (t.data && t.data.Event == SOCKETEVENT.web_redpacket_receive && e.onRedPacketReceive && e.onRedPacketReceive({
                  pfid: t.data.pfid,
                  name: t.data.nickname,
                  sendPfid: t.data.send_pfid,
                  sendName: t.data.send_nickname,
                  gold: t.data.gold
                }),
                t.data && t.data.Event == SOCKETEVENT.packet_delay_list && e.onRedPacketList) {
                if (!t.data.list || !t.data.list.length)
                  return;
                t.data.list.forEach(function(e) {
                    e.start = parseInt(Math.floor(Date.now() / 1e3)),
                      e.uid = e.f_pfid + "" + e.stamp
                  }),
                  e.onRedPacketList({
                    liveId: t.data.live_id,
                    nowStamp: t.data.now_stamp,
                    list: t.data.list
                  })
              }
              t.data && t.data.Event == SOCKETEVENT.super_bullet && e.onSupperBullet && e.onSupperBullet({
                nick: t.data.nick,
                fname: t.data.nickname,
                displayTime: t.data.display_time,
                pfid: t.data.live_info.pfid,
                name: t.data.live_info.nickname,
                avatar: t.data.live_info.headimg,
                liveId: t.data.live_info.live_id
              })
            }),
            this.socket.on(SOCKETEVENT.close, function(t) {
              t.reason && "close" == t.reason && e.onClose && e.onClose()
            }),
            this.socket
        }
      }]),
      e
  }();
  t.exports = r
}
