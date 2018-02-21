/**
 * Simple toggle switch using jQuery. Copyright ©Joydeep Dey, 2018
 */

"use strict";

const
SHAPE = Object.freeze({
	BOX : 'BOX',
	OVAL : 'OVL'
});

const
size = Object.freeze({
	XL : 2,
	L : 1.6,
	M : 1.3,
	S : 1.4
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
	shape : '',
	changeColor : true
}

$.fn.initToggle = function(param) {
	this.hide();
	TOGGLE.filterParams(param);

	$.each(this, function(idx, elem) {
		if (!$(elem).next().hasClass('switch-div')) {
			var sDiv = TOGGLE.create($(elem));
			TOGGLE.update($(this));

			sDiv.find('.switch').click(function() {
				sDiv.prev().click();
			});

			$(elem).click(function(e) {
				TOGGLE.update($(this));
			});
		} else {
			console.log('Toggle switch is already created.')
		}
	});
}

$.fn.destroyToggle = function() {
	if ($(this).next().hasClass('switch-div')) {
		TOGGLE.remove($(this));
	} else {
		console.log('No toggle switch is found to destroy.');
	}
}

var TOGGLE = {
	filterParams : function(userParam) {
		if (userParam !== undefined && userParam !== null && userParam !== '') {
			INIT_PARAM.on = this.checkParams(userParam.on) ? userParam.on
					: 'On';
			INIT_PARAM.off = this.checkParams(userParam.off) ? userParam.off
					: 'Off';
			INIT_PARAM.onClass = this.checkParams(userParam.onClass) ? userParam.onstyle
					: 'sw-on';
			INIT_PARAM.offClass = this.checkParams(userParam.offClass) ? userParam.offstyle
					: 'sw-off';
			INIT_PARAM.labelSize = this.checkParams(userParam.size) ? userParam.size
					: '';
			INIT_PARAM.shape = this.checkParams(userParam.shape) ? userParam.shape
					: SHAPE.SQUARE;

			if (this.checkParams(userParam.onStyle))
				INIT_PARAM.onStyle = userParam.onstyle;
			if (this.checkParams(userParam.offStyle))
				INIT_PARAM.offStyle = userParam.offstyle;
		}

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

	create : function(target) {
		var toggle = $('<label class="switch">&nbsp;</label>');

		toggle.addClass(INIT_PARAM.onClass);
		toggle.addClass(INIT_PARAM.labelSize);

		var sDiv = $('<div class="switch-div"></div>').insertAfter(target);
		sDiv.append(toggle);
		toggle.append('<span class="toggle"></span>');

		var tElem = sDiv.find('.toggle');
		tElem.addClass(INIT_PARAM.spanSize);

		if (INIT_PARAM.shape === SHAPE.OVAL) {
			toggle.addClass('switch-oval');
			tElem.addClass('toggle-round');
		} else {
			toggle.addClass('switch-square');
			tElem.addClass('toggle-square');
		}

		return sDiv;
	},

	update : function(target) {
		var label = target.next().find('.switch');
		var span = label.children();
		if (target.is(':checked')) {

			this.addText(label, INIT_PARAM.on);
			if (label.hasClass(INIT_PARAM.offClass))
				label.removeClass(INIT_PARAM.offClass);
			label.addClass(INIT_PARAM.onClass);

			label.css('padding-left', '');
			label.css('padding-right', INIT_PARAM.padding + '%');

			var translate = (label.width() - span.width()) + 'px';
			span.css('transform', 'translateX(' + translate + ')');
			if (span.hasClass('t-off'))
				span.removeClass('t-off');
			span.addClass('t-on');
		} else {
			this.addText(label, INIT_PARAM.off);
			if (label.hasClass(INIT_PARAM.onClass))
				label.removeClass(INIT_PARAM.onClass);
			label.addClass(INIT_PARAM.offClass);

			label.css('padding-right', '');
			label.css('padding-left', INIT_PARAM.padding + '%');
			span.css('transform', '');
			if (span.hasClass('t-on'))
				span.removeClass('t-on');
			span.addClass('t-off');
		}
	},

	remove : function(target) {
		$(target).show();
		$(target).next().remove();

	},

	checkParams : function(param) {
		return ((param !== undefined) && (param != null) && (param.trim().length > 0));
	},

	addText : function(target, text) {
		var textNode = target[0].childNodes[0];
		var data = textNode.data;
		textNode.replaceData(0, data.length, text);
	}
}
