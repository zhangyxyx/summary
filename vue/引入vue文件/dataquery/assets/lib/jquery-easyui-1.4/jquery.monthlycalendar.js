/**
 * @author Maml
 */
(function($){
	function setSize(target){
		var opts = $.data(target, 'monthlycalendar').options;
		var t = $(target);
		if (opts.fit == true){
			var p = t.parent();
			opts.width = p.width();
			opts.height = p.height();
		}
		var header = t.find('.monthlycalendar-header');
		t._outerWidth(opts.width);
		t._outerHeight(opts.height);
		t.find('.monthlycalendar-body')._outerHeight(t.height() - header._outerHeight());
	}
	
	function init(target){
		$(target).addClass('monthlycalendar').wrapInner(
				'<div class="monthlycalendar-header">' +
					'<div class="monthlycalendar-prevyear"></div>' +
					'<div class="monthlycalendar-nextyear"></div>' +
					'<div class="monthlycalendar-title">' +
						'<span>2015</span>' +
					'</div>' +
				'</div>' +
				'<div class="monthlycalendar-body">' +
				'</div>'
		);
		$('.monthlycalendar-prevyear,.monthlycalendar-nextyear', target).hover(
			function(){$(this).addClass('monthlycalendar-nav-hover');},
			function(){$(this).removeClass('monthlycalendar-nav-hover');}
		);
		$(target).find('.monthlycalendar-nextyear').click(function(){
			showYear(target, 1);
		});
		$(target).find('.monthlycalendar-prevyear').click(function(){
			showYear(target, -1);
		});
		
		$(target).bind('_resize', function(){
			var opts = $.data(target, 'monthlycalendar').options;
			if (opts.fit == true){
				setSize(target);
			}
			return false;
		});
	}
	
	/**
	 * show the calendar corresponding to the current year.
	 */
	function showYear(target, delta){
		var opts = $.data(target, 'monthlycalendar').options;
		opts.year += delta;
		show(target);
	}
	
	/**
	 * show the calendar day.
	 */
	function show(target){
		var opts = $.data(target, 'monthlycalendar').options;
		$(target).find('.monthlycalendar-title span').html(opts.year);
		var body = $(target).find('div.monthlycalendar-body');
		body.find('>table').remove();
		
		var t = $('<table cellspacing="0" cellpadding="0" border="0"><tbody></tbody></table>').prependTo(body);
		var tr = $('<tr></tr>').appendTo(t.find('tbody'));
		for(var i=0;i<4;i++){
			tr.append("<td class=\"monthlycalendar-month\" abbr=\""+opts.year+","+(i+1)+"\">"+opts.months[i]+"</td>");
		}
		tr = $('<tr></tr>').appendTo(t.find('tbody'));
		for(var i=4;i<8;i++){
			tr.append("<td class=\"monthlycalendar-month\" abbr=\""+opts.year+","+(i+1)+"\">"+opts.months[i]+"</td>");
		}
		tr = $('<tr></tr>').appendTo(t.find('tbody'));
		for(var i=8;i<12;i++){
			tr.append("<td class=\"monthlycalendar-month\" abbr=\""+opts.year+","+(i+1)+"\">"+opts.months[i]+"</td>");
		}
		var now = new Date();
		var month = now.getFullYear()+','+(now.getMonth()+1);
		t.find('td[abbr="'+month+'"]').addClass('monthlycalendar-month');
		
		if (opts.current){
			t.find('.monthlycalendar-selected').removeClass('monthlycalendar-selected');
			var current = opts.current.getFullYear()+','+(opts.current.getMonth()+1);
			t.find('td[abbr="'+current+'"]').addClass('monthlycalendar-selected');
		}
		
		t.find('td').hover(
			function(){$(this).addClass('monthlycalendar-hover');},
			function(){$(this).removeClass('monthlycalendar-hover');}
		).click(function(){
			t.find('.monthlycalendar-selected').removeClass('monthlycalendar-selected');
			$(this).addClass('monthlycalendar-selected');
			var parts = $(this).attr('abbr').split(',');
			opts.current = new Date(parts[0], parseInt(parts[1])-1);
			opts.onSelect.call(target, opts.current);
		});
	}
	
	$.fn.monthlycalendar = function(options, param){
		if (typeof options == 'string'){
			return $.fn.monthlycalendar.methods[options](this, param);
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'monthlycalendar');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'monthlycalendar', {
					options:$.extend({}, $.fn.monthlycalendar.defaults, $.fn.monthlycalendar.parseOptions(this), options)
				});
				init(this);
			}
			if (state.options.border == false){
				$(this).addClass('monthlycalendar-noborder');
			}
			setSize(this);
			show(this);
		});
	};
	
	$.fn.monthlycalendar.methods = {
		options: function(jq){
			return $.data(jq[0], 'monthlycalendar').options;
		},
		resize: function(jq){
			return jq.each(function(){
				setSize(this);
			});
		},
		moveTo: function(jq, date){
			return jq.each(function(){
				$(this).monthlycalendar({
					year: date.getFullYear(),
					month: date.getMonth()+1,
					current: date
				});
			});
		}
	};
	
	$.fn.monthlycalendar.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height',{firstDay:'number',fit:'boolean',border:'boolean'}
		]));
	};
	
	$.fn.monthlycalendar.defaults = {
		width:180,
		height:180,
		fit:false,
		border:true,
		months:['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
		year:new Date().getFullYear(),
		month:new Date().getMonth()+1,
		current:new Date(),
		onSelect: function(date){}
	};
})(jQuery);
