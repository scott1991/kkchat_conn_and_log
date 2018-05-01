const htmlparser = require("htmlparser2");
const https = require('https');


function getRoomInfo( roomId ){
  return new Promise(function(resolve, reject){
    let inf = null ;
    https.get({ hostname: 'www.kingkong.com.tw', path: '\/'+roomId },function(res){
      res.on('data', (d) => {
        parser.write(d);
      });

      res.on('end',function(){
        // console.log("http end");
        parser.end();
        resolve(inf);
      });

      res.on('timeout',function(){
        // console.log("timeout");
        reject(new Error("timeout"));
      })
    });

    const parser = new htmlparser.Parser({
      onopentag: function(name, attribs){
        if(name === "div" ){
          if (attribs["data-roominfo"] || attribs["data-roomInfo"] ){
            let dri = attribs["data-roominfo"] ? attribs["data-roominfo"] : attribs["data-roomInfo"] ;
            inf = JSON.parse(attribs["data-roominfo"]);
          }
        }
      },
      onend: function(){
        // console.log("parser end");
      },
      onerror: function(err){
        reject(err);
      }
    }, {decodeEntities: true});
  })
}




module.exports = {getRoomInfo:getRoomInfo};
