const
MAX_LEN = 4;
const
ERASE_MODE = Object.freeze({
	single : 0,
	multi : MAX_LEN
});
const
ERASE_TYPE = Object.freeze({
	BCK_SPC : 'deleteContentBackward',
	DEL : 'deleteContentForward'
});
var OLD_VAL = '';

$(function() {
	$('#msg-div').hide();
	$('.md-in').change(function() {
		setInputPanel();
	});
	$('.md-pg').change(function() {
		changePageMode();
	});

	$('#text').on('input paste', function(e) {
		handleInput(this, e);
	});

	$('#lck-scr').click(function() {
		promptLock();
	});
	$('#action-btn').click(function() {
		lockUnlockScreen();
	});
	$('#show-hide-btn').click(function() {
		showHideContent();
	});
	$('#reset-btn').click(function() {
		resetContent();
	});

	$('#md-deco').change(function() {
		modifyDecoration();
	});
});