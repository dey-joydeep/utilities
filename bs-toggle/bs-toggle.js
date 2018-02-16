var _groupCnt = 0;
const
INIT_PARAM = {
	on : '',
	off : '',
	onstyle : '',
	offstyle : '',
	labelSize : '',
	spanSize : '',
	padding : 0,
	isOnOutlined : false,
	isOffOutlined : false,
	jQueryClass : ''
}

$.fn.initToggle = function(param) {
	this.hide();
	TOGGLE.filterParams(param);

	$.each(this, function(idx, elem) {
		var sDiv = TOGGLE.createSwitches($(elem));
		$(elem).appendTo(sDiv);
		TOGGLE.handleSwitchSize();
		TOGGLE.handleSwitchColor();

		sDiv.find('.switch').click(function() {
			sDiv.find('input[type=checkbox]').click();
		});

		$(elem).click(function(e) {
			sDiv.find('.switch').toggle();
			e.originalEvent.stopImmediatePropagation;
		});
	});
	_groupCnt++;
}

var TOGGLE = {
	filterParams : function(userParam) {
		if (userParam !== undefined && userParam !== null && userParam !== '') {
			INIT_PARAM.on = this.checkParams(userParam.on) ? userParam.on
					: 'On';
			INIT_PARAM.off = this.checkParams(userParam.off) ? userParam.off
					: 'Off';
			INIT_PARAM.onstyle = this.checkParams(userParam.onstyle) ? userParam.onstyle
					: 'primary';
			INIT_PARAM.offstyle = this.checkParams(userParam.offstyle) ? userParam.offstyle
					: 'light';
			INIT_PARAM.labelSize = this.checkParams(userParam.size) ? userParam.size
					: '';
		}

		var size = {
			def : 45,
			sm : 40,
			lg : 50
		};

		INIT_PARAM.onstyle = 'btn-' + INIT_PARAM.onstyle.toLowerCase();
		INIT_PARAM.offstyle = 'btn-' + INIT_PARAM.offstyle.toLowerCase();

		switch (INIT_PARAM.labelSize.toLowerCase()) {
		case 'large':
			INIT_PARAM.labelSize = 'btn-lg';
			INIT_PARAM.spanSize = 'toggle-lg';
			INIT_PARAM.padding = size.lg;
			INIT_PARAM.jQueryClass = 'sw-lg';
			break;
		case 'small':
			INIT_PARAM.labelSize = 'btn-sm';
			INIT_PARAM.spanSize = 'toggle-sm';
			INIT_PARAM.padding = size.sm;
			INIT_PARAM.jQueryClass = 'sw-sm';
			break;
		default:
			INIT_PARAM.labelSize = '';
			INIT_PARAM.spanSize = 'toggle-def';
			INIT_PARAM.padding = size.def;
			INIT_PARAM.jQueryClass = 'sw-def';
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

		sDiv.find('.toggle').addClass(INIT_PARAM.spanSize);

		if (target.is(':checked')) {
			offLabel.hide();
		} else {
			onLabel.hide();
		}

		return sDiv;
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
						$(this).find('.t-off').css('background-color',
								COLOR_HANDLER.getBGColor($(this)));
					});
		}

		if (INIT_PARAM.isOnOutlined) {
			$('.switch-on-' + _groupCnt).hover(
					function() {
						$(this).find('.t-on').css('background-color', '#fff');
					},
					function() {
						$(this).find('.t-on').css('background-color',
								COLOR_HANDLER.getBGColor($(this)));
					});
		}
	},
	checkParams : function(param) {
		return ((param !== undefined) && (param != null) && (param.trim().length > 0));
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
