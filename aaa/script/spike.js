
$(function($){
	
	// Number of seconds in every time division
	var hours	= 60*60,
		minutes	= 60;
	
	// Creating the plugin
	$.fn.countdown = function(prop){
		
		var options = $.extend({
			callback	: function(){},
			timestamp	: 0
		},prop);
		
		var left,  h, m, s, positions;

		// Initialize the plugin
		init(this);
		
		positions = this.find('.position');
		
		(function tick(){
			
			// Time left
			left = Math.floor((options.timestamp - (new Date())) / 1000);
			
			if(left < 0){
				left = 0;
			}
			
			// Number of hours left
			h = Math.floor(left / hours);
			updateDuo(0, 1, h);
			left -= h*hours;
			
			// Number of minutes left
			m = Math.floor(left / minutes);
			updateDuo(2, 3, m);
			left -= m*minutes;
			
			// Number of seconds left
			s = left;
			updateDuo(4, 5, s);
			
			// Calling an optional user supplied callback
			options.callback(h, m, s);
			
			// Scheduling another call of this function in 1s
			setTimeout(tick, 1000);
		})();
		
		// This function updates two digit positions at once
		function updateDuo(minor,major,value){
			switchDigit(positions.eq(minor),Math.floor(value/10)%10);
			switchDigit(positions.eq(major),value%10);
		}
		
		return this;
	};


	function init(elem, options){
		elem.addClass('countdownHolder');

		// Creating the markup inside the container
		$.each(['Hours','Minutes','Seconds'],function(i){
			$('<span class="count'+this+'">').html(
				'<span class="position">\
					<span class="digit static">0</span>\
				</span>\
				<span class="position">\
					<span class="digit static">0</span>\
				</span>'
			).appendTo(elem);
			
			if(this!="Seconds"){
				elem.append('<span class="countDiv countDiv'+i+'"></span>');
			}
		});

	}

	// Creates an animated transition between the two numbers
	function switchDigit(position,number){
		
		var digit = position.find('.digit')
		
		if(digit.is(':animated')){
			return false;
		}
		
		if(position.data('digit') == number){
			// We are already showing this number
			return false;
		}
		
		position.data('digit', number);
		
		var replacement = $('<span>',{
			'class':'digit',
			css:{
				top:'-60px',
				opacity:0
			},
			html:number
		});
		
		
		digit
			.before(replacement)
			.removeClass('static')
			.animate({top:'2.5em',opacity:0},'fast',function(){
				digit.remove();
			})

		replacement
			.delay(100)
			.animate({top:0,opacity:1},'fast',function(){
				replacement.addClass('static');
			});
	}
});


$(function(){
	
	var ts = new Date(2012, 0, 1),
		newYear = true;
	if((new Date()) > ts){
		ts = (new Date()).getTime() + 99*60*60*1000;
		newYear = false;
	}
		
	$('.spike-header-countdown').countdown({
		timestamp	: ts,
		callback	: function(hours, minutes, seconds){
		}
	});
	
});

var timeArr = []
 
for(let i=0;i<8;i++){
	timeArr.push({"time":`${i}0:00`,"whetherSelect":false})
}


var commodity = []
for(let i=2;i<38;i++){
	let img_url = `../IMG/commodity/${i}.png`
	commodity.push({"imgurl":img_url,"seen":true})
}
var spike = new Vue({
	el:"#spike",
	data:{
		timeArr,
		commodity
	},
	mounted:function(){
		this.init()
	},
	methods:{
		selected:function(item){
			timeArr.forEach(function(value,index){
				value.whetherSelect = false
			})
			item.whetherSelect = true
		},
		toggleModal:function(item){
			commodity.forEach(function(value,index){
				value.seen = true
			})
			item.seen  = false
		},
		init:function(){
			timeArr[0].whetherSelect = true

		}
	}
})
