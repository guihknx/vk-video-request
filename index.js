var VKL = require('./VKLeecher');

var instance = new VKL({
	urls : ['http://VK_VIDEO_URL'],
	tags: ['script']
});

instance.VKDownload(0,function(res, err) {
	var result = [],
	endT;
	
  if (err) {
    console.log(err);
  }

  res.tags.forEach(function(i){
  	result[i] = res.html(i)
  	endT = res.html(i)[5].children[0].data.match(/var vars = {"(.*?)"}/g);
  });

  var fname = endT[0].split('md_title')[1].split(',')[0].split(':')[1].split('"').join('')+'.mp4';
  var target = endT[0].split('url')[2].split(',')[0].split(':')[2].split('\\/').join('/').replace('"','');
  instance.checkDir('http:'+target, fname);

});
