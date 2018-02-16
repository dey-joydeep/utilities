var _groupCnt = 0;
const
INIT_PARAM = {
	on : 'On',
	off : 'Off',
	onstyle : 'primary',
	offstyle : 'light',
	labelSize : '',
	spanSize : '',
	padding : 0,
	isOnOutlined : false,
	isOffOutlined : false,
	jQueryClass : ''
}

function init(target, param) {
	target.hide();
	// $.each(target, function(k, v) {
	// console.log(k);
	// console.log(v);
	// });
	TOGGLE.filterParams(param);
	TOGGLE.createSwitches(target);

	$('.switch').click(function() {
		target.click();
	});

	target.click(function() {
		$('.switch').toggle();
	});

	TOGGLE.handleSwitchSize();
	TOGGLE.handleSwitchColor();

	_groupCnt++;
}

var TOGGLE = {
	filterParams : function(userParam) {
		if (userParam !== undefined && userParam !== null && userParam !== '') {
			INIT_PARAM.on = userParam.on
			INIT_PARAM.off = userParam.off
			INIT_PARAM.onstyle = userParam.onstyle
			INIT_PARAM.offstyle = userParam.offstyle
			INIT_PARAM.labelSize = userParam.size
		}

		var size = {
			def : 50,
			sm : 43,
			lg : 55
		};

		INIT_PARAM.onstyle = 'btn-' + INIT_PARAM.onstyle.toLowerCase();
		INIT_PARAM.offstyle = 'btn-' + INIT_PARAM.offstyle.toLowerCase();

		switch (INIT_PARAM.labelSize.toLowerCase()) {
		case 'large':
			INIT_PARAM.labelSize = 'btn-lg';
			INIT_PARAM.spanSize = 'toggle-lg';
			INIT_PARAM.padding = size.lg;
			INIT_PARAM.jQueryClass = '.sw-lg';
			break;
		case 'small':
			INIT_PARAM.labelSize = 'btn-sm';
			INIT_PARAM.spanSize = 'toggle-sm';
			INIT_PARAM.padding = size.sm;
			INIT_PARAM.jQueryClass = '.sw-sm';
			break;
		default:
			INIT_PARAM.labelSize = '';
			INIT_PARAM.spanSize = 'toggle-def';
			INIT_PARAM.padding = size.def;
			INIT_PARAM.jQueryClass = '.sw-def';
			break;
		}

		INIT_PARAM.padding = INIT_PARAM.padding;
		INIT_PARAM.isOnOutlined = INIT_PARAM.onstyle.includes('outline');
		INIT_PARAM.isOffOutlined = INIT_PARAM.offstyle.includes('outline');
	},

	createSwitches : function(target) {
		var onLabel = $('<label class="switch switch-on-' + _groupCnt
				+ ' btn"></label>');
		var offLabel = $('<label class="switch switch-off-' + _groupCnt
				+ ' btn"></label>');

		onLabel.text(INIT_PARAM.on);
		offLabel.text(INIT_PARAM.off);

		onLabel.addClass(INIT_PARAM.onstyle);
		onLabel.addClass(INIT_PARAM.jQueryClass);
		offLabel.addClass(INIT_PARAM.offstyle);
		offLabel.addClass(INIT_PARAM.jQueryClass);

		onLabel.addClass(INIT_PARAM.labelSize);
		offLabel.addClass(INIT_PARAM.labelSize);

		var sDiv = $('<div class="switch-div"></div>').insertAfter(target);
		sDiv.append(onLabel);
		onLabel.append('<span class="toggle t-on"></span>');
		sDiv.append(offLabel);
		offLabel.append('<span class="toggle t-off"></span>');

		$('.toggle').addClass(INIT_PARAM.spanSize);

		if (target.is(':checked')) {
			offLabel.hide();
		} else {
			onLabel.hide();
		}
	},

	handleSwitchSize : function() {
		$('.switch-off-' + _groupCnt).css('padding-left',
				INIT_PARAM.padding + '%');
		$('.switch-on-' + _groupCnt).css('padding-right',
				INIT_PARAM.padding + '%');
	},

	handleSwitchColor : function() {
		$('.switch-off-' + _groupCnt).find('.t-off').css('background-color',
				COLOR_HANDLER.getTextColor($('.switch-off-' + _groupCnt)));
		$('.switch-on-' + _groupCnt).find('.t-on').css('background-color',
				COLOR_HANDLER.getTextColor($('.switch-on-' + _groupCnt)));

		if (INIT_PARAM.isOffOutlined) {
			$('.switch-off-' + _groupCnt).hover(
					function() {
						$(this).find('.t-off').css('background-color', '#fff');
					},
					function() {
						$(this).find('.t-on').css('background-color',
								COLOR_HANDLER.getBGColor($(this)));
					});
		}

		if (INIT_PARAM.isOnOutlined) {
			$('.switch-on-' + _groupCnt).hover(
					function() {
						$(this).find('.t-off').css('background-color', '#fff');
					},
					function() {
						$(this).find('.t-on').css('background-color',
								COLOR_HANDLER.getBGColor($(this)));
					});
		}
	}
}
var COLOR_HANDLER = {
	componentToHex : function(c) {
		var hex = parseInt(c).toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	},

	rgbToHex : function(rgbStr) {
		rgb = rgbStr.replace(new RegExp(/^rgb.*\(/, 'g'), '').replace(')', '')
				.split(',');
		return "#" + this.componentToHex(rgb[0]) + this.componentToHex(rgb[1])
				+ this.componentToHex(rgb[2]);
	},

	getBGColor : function(selector) {
		var bg = $(selector).css('background-color');
		return this.rgbToHex(bg);
	},

	getTextColor : function(selector) {
		var txt = $(selector).css('color');
		return this.rgbToHex(txt);
	}
}
