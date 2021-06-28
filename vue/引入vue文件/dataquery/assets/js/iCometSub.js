(function(window){
var _ = function (config) {
var self = this;
self.last_script = null;
self.next_seq = config.nextseq | 0;
self.url = config.url;
self.cname = config.chanelname;
self.cb = config.cb;
self.cbname = 'icomet_cb_' + self.cname;
self.subcall = function(msg) {
	console.log(msg);
	if($.isArray(msg)){
		var conarr = [];
		for(var i = 0; i < msg.length; i++){
			conarr.push(msg[i].content);
			if(i == msg.length-1){
                self.next_seq = parseInt(msg[i].seq) + 1;
			}
		}
        self.cb(conarr);
	}
	// if(msg.type == 'data') {
	// 	self.next_seq = parseInt(msg.seq) + 1;
	// 	self.cb(msg.content);
	// }
	else if(msg.type == 'next_seq') {
		self.next_seq = parseInt(msg.seq);
	} else if(msg.type == 'noop') {
		self.next_seq = parseInt(msg.seq);
	}
	
	self.change();
};
self.change = function() {
	setTimeout(function() {
		var body = document.getElementsByTagName('body')[0];
		if(self.last_script){
			body.removeChild(self.last_script);
		}
		var script = document.createElement('script');
		script.src = self.url + '/sub?cname=' + self.cname +'&cb=' + self.cbname + '&seq=' + self.next_seq;
		body.appendChild(script);
		self.last_script = script;
	},0);
}

window[self.cbname] = self.subcall;
self.change();
};
window.iComet = _;
})(window)