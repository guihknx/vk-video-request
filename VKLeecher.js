(function() {
  var fs = require('fs')
  ,path = require('path')
  ,request = require('request')
  ,http = require('http')
  ,VKLeecher
  ,read = require('read')
  ,http = require('http')
  ,cheerio = require('cheerio')
  ,colors = require('colors')
  ,ProgressBar = require('progress');;


  VKLeecher = (function() {
    function VKLeecher(config) {
      this.defaults = config;
    }
    VKLeecher.prototype.fetchHtml = function(url, callback) {

      http.get(url, function(res){
        var data="";

        res.on('data', function(chunk){
          data += chunk;
        });

        res.on('end', function(){
          callback(data);
        });

      }).on('error', function(){
        callback(null);
      });

    };
    VKLeecher.prototype.VKDownload = function(i, html){
      var that = this;
      var urlPattern = /^(https?:\/\/)([\da-z\.-]+).\.([a-z\.]{2,10})([\/\w\.-]*)*\/?$/;
     // console.log(this.defaults.urls[i])
      this.fetchHtml(this.defaults.urls[i],function(data){
        if(data){
          var dom = cheerio.load(data);
          html({html: dom, tags: that.defaults.tags })

          i++;
          if(!!that.defaults.urls[i]){
            VKDownload(that.defaults.urls,i);
          }else{
            return;
          }

        }else{
          console.log("error");
        }
      });
    };
    VKLeecher.prototype.download = function(url, dest, exists){
      console.log('Fetching data form(Please wait): '+url.split('/')[2])
      var file = fs.createWriteStream(dest);
      var request = http.get(url, function(response) {
        var len = parseInt(response.headers['content-length'], 10);
        var body = "";
        var cur = 0;
        var total = len / 1048576; 
        var bar = new ProgressBar('[+] downloading... [:bar] :percent :etas', {
          complete: '#',
          incomplete: ' ',
          width: 50,
          total: len
        });
        response.on("data", function(chunk) {
          body += chunk;
          cur += chunk.length;
          bar.tick(chunk.length);
          //process.stdout.write("Downloading ".inverse + (100.0 * cur / len).toFixed(2).inverse + "% ".inverse + (cur / 1048576).toFixed(2).inverse + " mb".inverse + ". Total: ".inverse + total.toFixed(2).inverse + " mb\r".inverse);
        });

        response.on("end", function() {
          console.log('\n');
        });

        request.on("error", function(e){
          console.log("Error: " + e.message);
        });
        response.pipe(file);
      });
    };
    VKLeecher.prototype.checkDir = function(url, dest, cb) {
      var that = this;
      if(!fs.existsSync("downloads/")){
        read({ prompt: 'Directory downloads/ doesn\'t exists, do you want create it? (y/n) ', silent: false }, function(er, exists) {
          if( exists == 'y'){
            fs.mkdirSync("downloads/", 0766, function(err){
              if(err){ 
                console.log(err);
                response.send("ERROR! Can't make the directory! \n");    
              }
            });   
          that.download(url, 'downloads/'+dest, 'y');
          }else{
            that.download(url, dest, 'y');
          }
        });          
      }else{
        this.download(url, 'downloads/'+dest, 'n');
      }

    };


    return VKLeecher;
  })();

  module.exports = VKLeecher;

}).call(this);
