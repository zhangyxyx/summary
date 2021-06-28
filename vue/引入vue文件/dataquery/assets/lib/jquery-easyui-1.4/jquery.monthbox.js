//先注释button功能，觉得没必要
(function($){
	/**
	 * create month box
	 */
	function createBox(target){
		var state = $.data(target, 'monthbox');
		var opts = state.options;
		
		$(target).addClass('monthbox-f').combo($.extend({}, opts, {
			onShowPanel:function(){
				setMonthlyCalendar();
				setValue(target, $(target).monthbox('getText'));
				opts.onShowPanel.call(target);
			}
		}));
		$(target).combo('textbox').parent().addClass('monthbox');
		
		/**
		 * if the monthlycalendar isn't created, create it.
		 */
		if (!state.monthlycalendar){
			createMonthlyCalendar();
		}
		
		function createMonthlyCalendar(){
			var panel = $(target).combo('panel').css('overflow','hidden');
			var cc = $('<div class="monthbox-monthlycalendar-inner"></div>').appendTo(panel);
			if (opts.sharedMonthlyCalendar){
				state.monthlycalendar = $(opts.sharedMonthlyCalendar).appendTo(cc);
				if (!state.monthlycalendar.hasClass('monthlycalendar')){
					state.monthlycalendar.monthlycalendar();
				}
			} else {
				state.monthlycalendar = $('<div></div>').appendTo(cc).monthlycalendar();
			}
			$.extend(state.monthlycalendar.monthlycalendar('options'), {
				fit:true,
				border:false,
				onSelect:function(date){
					var opts = $(this.target).monthbox('options');
					setValue(this.target, opts.formatter(date));
					$(this.target).combo('hidePanel');
					opts.onSelect.call(target, date);
				}
			});
			setValue(target, opts.value);
			
			/*var button = $('<div class="monthbox-button"><table cellspacing="0" cellpadding="0" style="width:100%"><tr></tr></table></div>').appendTo(panel);
			var tr = button.find('tr');
			for(var i=0; i<opts.buttons.length; i++){
				var td = $('<td></td>').appendTo(tr);
				var btn = opts.buttons[i];
				var t = $('<a href="javascript:void(0)"></a>').html($.isFunction(btn.text) ? btn.text(target) : btn.text).appendTo(td);
				t.bind('click', {target: target, handler: btn.handler}, function(e){
					e.data.handler.call(this, e.data.target);
				});
			}
			tr.find('td').css('width', (100/opts.buttons.length)+'%');*/
		}
		
		function setMonthlyCalendar(){
			var panel = $(target).combo('panel');
			var cc = panel.children('div.monthbox-monthlycalendar-inner');
			panel.children()._outerWidth(panel.width());
			state.monthlycalendar.appendTo(cc);
			state.monthlycalendar[0].target = target;
			if (opts.panelHeight != 'auto'){
				var height = panel.height();
				panel.children().not(cc).each(function(){
					height -= $(this).outerHeight();
				});
				cc._outerHeight(height);
			}
			state.monthlycalendar.monthlycalendar('resize');
		}
	}
	
	/**
	 * called when user inputs some value in text box
	 */
	function doQuery(target, q){
		setValue(target, q);
	}
	
	/**
	 * called when user press enter key
	 */
	function doEnter(target){
		var state = $.data(target, 'monthbox');
		var opts = state.options;
		var value = opts.formatter(state.monthlycalendar.monthlycalendar('options').current);
		setValue(target, value);
		$(target).combo('hidePanel');
	}
	
	function setValue(target, value){
		var state = $.data(target, 'monthbox');
		var opts = state.options;
		$(target).combo('setValue', value).combo('setText', value);
		state.monthlycalendar.monthlycalendar('moveTo', opts.parser(value));
	}
	
	$.fn.monthbox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.monthbox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'monthbox');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'monthbox', {
					options: $.extend({}, $.fn.monthbox.defaults, $.fn.monthbox.parseOptions(this), options)
				});
			}
			createBox(this);
		});
	};
	
	$.fn.monthbox.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'monthbox').options, {
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		monthlycalendar: function(jq){	// get the calendar object
			return $.data(jq[0], 'monthbox').monthlycalendar;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).monthbox('options');
				$(this).monthbox('setValue', opts.originalValue);
			});
		}
	};
	
	$.fn.monthbox.parseOptions = function(target){
		return $.extend({}, $.fn.combo.parseOptions(target), $.parser.parseOptions(target, ['sharedMonthlyCalendar']));
	};
	
	$.fn.monthbox.defaults = $.extend({}, $.fn.combo.defaults, {
		panelWidth:180,
		panelHeight:'auto',
		sharedMonthlyCalendar:null,
		
		keyHandler: {
			up:function(e){},
			down:function(e){},
			left: function(e){},
			right: function(e){},
			enter:function(e){doEnter(this)},
			query:function(q,e){doQuery(this, q)}
		},
		
		currentText:'ThisMonth',
		closeText:'Close',
		okText:'Ok',
		
		/*buttons:[{
			text: function(target){return $(target).monthbox('options').currentText;},
			handler: function(target){
				$(target).monthbox('monthlycalendar').monthlycalendar({
					year:new Date().getFullYear(),
					month:new Date().getMonth()+1,
					current:new Date()
				});
				doEnter(target);
			}
		},{
			text: function(target){return $(target).monthbox('options').closeText;},
			handler: function(target){
				$(this).closest('div.combo-panel').panel('close');
			}
		}],*/
		
		formatter:function(date){
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			if(m<10){
				m="0"+m
			}
			return y + '-' + m;
		},
		parser:function(s){
			var t = Date.parse(s);
			if (!isNaN(t)){
				return new Date(t);
			} else {
				return new Date();
			}
		},
		
		onSelect:function(date){}
	});
})(jQuery);
