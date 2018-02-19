/**
 * Simple toggle switch using jQuery. Copyright ©Joydeep Dey, 2018
 */

var _groupCnt = 0;
const
SHAPE = Object.freeze({
	SQUARE : 1,
	ROUND : 0
});
const
INIT_PARAM = {
	onText : 'On',
	offText : 'Off',
	onClass : '',
	offClass : '',
	onStyle : '',
	offStyle : '',
	labelSize : '',
	spanSize : '',
	padding : 0,
	shape : SHAPE.SQUARE,
	changeColor : true
}

$.fn.initToggle = function(param) {
	this.hide();
	TOGGLE.filterParams(param);

	$.each(this, function(idx, elem) {
		var sDiv = TOGGLE.createSwitches($(elem));
		$(elem).appendTo(sDiv);
		TOGGLE.handleSwitchSize(sDiv);
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

$.fn.destroyToggle = function() {

}

var TOGGLE = {
	filterParams : function(userParam) {
		if (userParam !== undefined && userParam !== null && userParam !== '') {
			INIT_PARAM.on = this.checkParams(userParam.on) ? userParam.on
					: 'On';
			INIT_PARAM.off = this.checkParams(userParam.off) ? userParam.off
					: 'Off';
			INIT_PARAM.onClass = this.checkParams(userParam.onClass) ? userParam.onstyle
					: 'switch-basic';
			INIT_PARAM.offClass = this.checkParams(userParam.offClass) ? userParam.offstyle
					: '';
			INIT_PARAM.labelSize = this.checkParams(userParam.size) ? userParam.size
					: '';

			if (this.checkParams(userParam.onStyle))
				INIT_PARAM.onStyle = userParam.onstyle;
			if (this.checkParams(userParam.offStyle))
				INIT_PARAM.offStyle = userParam.offstyle;
		}

		var size = {
			XL : 45,
			L : 50,
			M : 20,
			S : 16
		};

		INIT_PARAM.onStyle = INIT_PARAM.onStyle.toLowerCase();
		INIT_PARAM.offStyle = INIT_PARAM.offStyle.toLowerCase();

		switch (INIT_PARAM.labelSize.toUpperCase()) {
		case 'XL':
			INIT_PARAM.labelSize = 'switch-xl';
			INIT_PARAM.spanSize = 'toggle-xl';
			INIT_PARAM.padding = size.XL;
			break;
		case 'L':
			INIT_PARAM.labelSize = 'switch-l';
			INIT_PARAM.spanSize = 'toggle-l';
			INIT_PARAM.padding = size.L;
			break;
		case 'M':
			INIT_PARAM.labelSize = 'switch-m';
			INIT_PARAM.spanSize = 'toggle-m';
			INIT_PARAM.padding = size.M;
			break;
		default:
			INIT_PARAM.labelSize = 'switch-s';
			INIT_PARAM.spanSize = 'toggle-s';
			INIT_PARAM.padding = size.S;
			break;
		}

		INIT_PARAM.padding = INIT_PARAM.padding;
	},

	createSwitches : function(target) {
		var onLabel = $('<label class="switch switch-on"></label>');
		var offLabel = $('<label class="switch switch-off"></label>');

		onLabel.text(INIT_PARAM.on);
		offLabel.text(INIT_PARAM.off);

		onLabel.addClass(INIT_PARAM.onClass);
		offLabel.addClass(INIT_PARAM.offClass);

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

	handleSwitchSize : function(parent) {
		parent.find('.switch-off').css('padding-left', INIT_PARAM.padding + '%');
		parent.find('.switch-on').css('padding-right', INIT_PARAM.padding + '%');
	},

	handleSwitchColor : function() {
		$('.switch-off').find('.t-off').css('background-color',
				COLOR_HANDLER.getTextColor($('.switch-off')));
		$('.switch-on').find('.t-on').css('background-color',
				COLOR_HANDLER.getTextColor($('.switch-on')));
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
