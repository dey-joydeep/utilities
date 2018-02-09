function getIndexOfFocusedElement() {
	var index = 0;
	if ($("#text>.data").length !== 0)
		index = $("#text>.data").index(
				document.getSelection().focusNode.parentElement);
	if (index < 0)
		index = 0;
	return index;
}

function getCursorPosition() {
	var cursorPos = getIndexOfFocusedElement() * MAX_LEN
			+ document.getSelection().focusOffset;
	return cursorPos;
}

function setCaret(node, pos) {
	if (node.textContent.length !== 0) {
		var range = document.createRange();
		var sel = document.getSelection();
		range.setStart(node.lastChild, pos);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	}
	node.focus();
}

function eraseContent(field, direction, mode) {
	var children = field.children;
	if (children.length === 0) {
		$(field).empty();
		return;
	}

	for (var i = 0; i < children.length; i++) {
		var currentConent = children[i].textContent;
		if (currentConent.length !== MAX_LEN) {

			switch (mode) {
			case ERASE_MODE.single:
				var pos = document.getSelection().focusOffset;
				if (pos === 1) {
					children[i].textContent = currentConent.substring(1, pos)
							+ currentConent.substring(pos);
				} else {
					children[i].textContent = currentConent.substring(0,
							pos - 1)
							+ currentConent.substring(pos);
				}
				setCaret(children[i], pos - 1);
				break;
			case ERASE_MODE.multi:
				$(children[i]).remove();
				break;
			}

			// Break out of loop
			break;
		}
	}
}

function modifyDecoration() {
	var pos = getCursorPosition();
	var field = $('#text');
	var fragments = field.find('.data');

	if ($('#md-deco').is(':checked')) {
		for (var i = 0; i < fragments.length; i++) {
			$(fragments[i]).addClass('deco-str');
		}
	} else {
		for (var i = 0; i < fragments.length; i++) {
			$(fragments[i]).removeClass('deco-str');
		}
	}

	// Check if initial position is 0
	if (pos !== 0) {
		// get element index in a set of 4
		var index = parseInt(pos / MAX_LEN);

		// get the cursor position in set
		pos %= MAX_LEN;

		var realIndex = (pos === 0) ? index : (index + 1);
		field = field.find('.data:nth-child(' + realIndex + ')');

		// If remainder was 0, cursor should be at 4th position
		if (pos === 0)
			pos = MAX_LEN;
	}
	setCaret(field[0], pos);

	if ($('#status').val() === '1') {
		$('#display').height($("#text").height());
	}
}

function handleInput(elem, e) {
	if ($('#md-dec').is(':checked')) {
		return;
	}

	if ($("#status").val() === "1") {
		showHideContent();
	}

	var inputType = e.originalEvent.inputType || e.originalEvent.type;
	if (elem.textContent.length > 0
			&& (inputType === ERASE_TYPE.BCK_SPC || inputType === ERASE_TYPE.DEL)) {
		eraseContent(elem, inputType, ERASE_MODE.multi);
		return;
	}

	var inputData = e.originalEvent.clipboardData === undefined ? e.originalEvent.data
			: e.originalEvent.clipboardData.getData('Text');
	if (isValidInput(inputData, inputType)) {
		if (inputType === 'insertParagraph') {
			inputData = '↯';
		} else {
			if (inputType !== 'paste')
				eraseContent(elem, ERASE_TYPE.BCK_SPC, ERASE_MODE.single);
			else
				e.preventDefault();
		}
		encodeInput(inputData);
	}
}

function isValidInput(data, inputType) {
	// TODO: Input data validation (verify as printable ASCII)

	var field = $('#text');
	var cursorPoition = document.getSelection().focusOffset;

	if (inputType === 'insertParagraph') {
		if (field.text().length === 0) {
			$(field).empty();
			return true;
		}
		var rmElems = field.children().not('.data');
		for (var i = 0; i < rmElems.length; i++) {
			var currElem = $(rmElems[i]);
			var prevElem = currElem.prev();
			var prevTextLen = prevElem.text().length;
			if (prevTextLen % MAX_LEN !== 0)
				prevElem.text(prevElem.text() + currElem.text());
			else
				$(currElem.html()).insertAfter(prevElem);
			currElem.remove();
			setCaret(prevElem[0], prevTextLen);
			if (prevTextLen % MAX_LEN === 0)
				return true;
		}
	} else if (inputType === 'paste' && cursorPoition % MAX_LEN === 0) {
		return true;
	} else {

		if (data === null)
			return false;

		var field = $('#text');
		if (field.text().length == 1 || (cursorPoition - 1) % MAX_LEN === 0)
			return true;
	}
	var errMsg = 'Invalid input at location ';
	eraseContent(field[0], 'deleteContentBackward', ERASE_MODE.single);

	if ($('#md-deco').is(':checked')) {
		modifyDecoration();
		errMsg += '(' + (getIndexOfFocusedElement() + 1) + ', '
				+ document.getSelection().focusOffset + ')';
	} else {
		errMsg += getCursorPosition();
	}

	removeAlertClass();
	$('#msg-div').addClass('alert-danger');
	$('#msg-div').text(errMsg);
	$("#msg-div").show().delay(10000).fadeOut();

	return false;
}

function encodeInput(data) {
	var cursorPos = document.getSelection().focusOffset;
	var newStrEncoded = controlContent(data, 0);
	var node = $('<p class="data">' + newStrEncoded + '</p>');
	var index = getIndexOfFocusedElement() + 1;
	var targetElem = $('#text').find('.data:nth-child(' + index + ')');
	if (targetElem.length === 0) {
		$('#text').append(node);
	} else {
		if (cursorPos === 0) {
			node.insertBefore(targetElem);
		} else {
			node.insertAfter(targetElem);
		}
	}
	setCaret(node[0], MAX_LEN);

	if ($('#md-deco').is(':checked'))
		modifyDecoration();
}

function setInputPanel() {
	var cursorPos = getCursorPosition();
	var modeEnc = $("#md-enc");
	var inText = $("#text");
	$(inText).css("display", "inline-block");
	var elemBtn = $("#show-hide-btn");

	if (!$('#reset-btn').is(':visible'))
		$('#reset-btn').show();

	var mode = $(modeEnc).is(':checked') ? 0 : 1;

	var textVal = $(inText).text();
	if (textVal !== null && textVal.length > 0) {
		textVal = controlContent(textVal, mode);
	}

	if (mode === 0) {
		$(elemBtn).show();
		var status = $("#status").text();
		if (status === "1") {
			var displayBoxStyle = $("#display");
			$(displayBoxStyle).show();
			$(displayBoxStyle).height($(inText).height());
		}
		$('#sub-div-deco').css('display', 'inline');

		inText.empty();
		var fragments = textVal.split(/(?=(?:....)*$)/);
		// For each set, put into <P> and append to the DIV
		for (var i = 0; i < fragments.length; i++) {
			content = $('<p class="data">' + fragments[i] + '</p>');
			inText.append(content);
		}
		cursorPos *= MAX_LEN
		if ($('#md-deco').is(':checked'))
			modifyDecoration();
	} else {
		$(elemBtn).hide();
		$("#display").hide();
		mode = 1;
		$('#sub-div-deco').hide();
		if (!cursorPos % MAX_LEN === 0) {
			cursorPos += (cursorPos % MAX_LEN);
			cursorPos /= MAX_LEN;
		}
		$(inText).text(content);
	}
	setCaret(inText[0], cursorPos);
}

function showHideContent() {
	var elemStatus = $("#status");
	var elemDisplay = $("#display");
	var elemBtn = $("#show-hide-btn");

	if ($(elemStatus).val() === "0") {
		var oldStrEncoded = $("#text").text();

		if (oldStrEncoded.length === 0) {
			removeAlertClass();
			$('#msg-div').addClass('alert-warning');
			$('#msg-div').text('No content is available to display.');
			$("#msg-div").show().delay(10000).fadeOut();
			return;
		}

		var newStrDecoded = controlContent(oldStrEncoded, 1);

		$(elemDisplay).text(newStrDecoded);
		$(elemDisplay).css('display', 'inline-block');
		$(elemDisplay).height($("#text").height());
		$(elemStatus).val("1");
		$(elemBtn).text("Hide Original Content");
	} else {
		$(elemDisplay).empty();
		$(elemDisplay).hide();
		$(elemStatus).val("0");
		$(elemBtn).text("Display Original Content");
	}

	$("#text").focus();
}

function controlContent(content, mode) {
	var newContent = "";
	if (mode === 0) { // Encode
		for (var i = 0; i < content.length; i++) {
			var char = content.charAt(i);
			if (char === '↯')
				char = '\n';
			var code = char.charCodeAt(i).toString(16).toUpperCase();
			newContent += code.length < MAX_LEN ? "0000".substr(0, MAX_LEN
					- code.length)
					+ code : code;
		}
	} else {
		var parts = content.match(/.{1,4}/g);
		for (var i = 0; i < parts.length; i++) {
			newContent += String.fromCharCode('0x' + parts[i]);
		}
	}

	return newContent;
}

function resetContent() {
	$("#text").empty();
	$("#display").hide();
	$("#show-hide-btn").text("Display Original Content");
	$("#status").val("0");
	OLD_VAL = '';
	var text = $('#text')[0];
	var offset = (text.offsetHeight - text.clientHeight) * 0.5;
	$(text).height('auto').height(text.scrollHeight + offset);
	$(text).focus();
}

function removeAlertClass() {
	$("#msg-div").removeClass(function(index, className) {
		return (className.match(/(^|\s)alert-\S+/g) || []).join(' ');
	});
}

function changePageMode() {
	// TODO
}
