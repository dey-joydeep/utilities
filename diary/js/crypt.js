var passwordMain = '';

function promptLock() {
	var modal = $('#modal');
	$(modal).show();
	$("#close").click(function() {
		$(modal).hide();
	});
}

var mainBody = "";
var values = [ "", "", "" ];

function lockUnlockScreen() {
	var pswdBox = $("#pswd");
	var password = $(pswdBox).val();
	var actionBtn = $("#action-btn");
	$(pswdBox).removeClass('in-err');
	$(pswdBox).val('');
	if (password !== null && password.length > 0) {
		if ($(actionBtn).val() === '0') {
			passwordMain = password;
			mainBody = xorCipher($('#content-div').html(), password, 'e');

			if ($("#md-enc").is(":checked")) {
				values[0] = xorCipher(("md-enc"), password, 'e');
			} else if ($("#md-dec").is(":checked")) {
				values[0] = xorCipher(("md-dec"), password, 'e');
			} else {
				values[0] = xorCipher(("none"), password, 'e');
			}

			var textElem = $("#text");

			values[1] = xorCipher($("#text").text(), password, 'e');
			values[2] = xorCipher($("#status").val(), password, 'e');

			$(actionBtn).text('Unlock');
			$(actionBtn).val('1');
			$("#close").hide();
			$('#content-div').empty();
		} else {
			var errSpan = $("#pswd-err");
			$(errSpan).empty();
			if (passwordMain !== password) {
				$(errSpan).text("Invalid Password!");
				$(pswdBox).attr("class", "in-err");
			} else {
				mainBody = xorCipher(mainBody, password, 'd');
				values[0] = xorCipher(values[0], password, 'd');
				values[1] = xorCipher(values[1], password, 'd');
				values[2] = xorCipher(values[2], password, 'd');

				$('#content-div').append(mainBody);
				$('#' + values[0]).prop("checked", true)
				$('#text').val(values[1]);

				if (values[0] === 'md-enc' && values[2] === '1') {
					$('#status').val('0');
					showHideContent();
				}

				$("#close").show();
				$(actionBtn).text('Lock');
				$(actionBtn).val('0');
				$(modal).hide();
			}
		}
	} else {
		$(pswdBox).attr("class", "in-err");
	}
}

function stringToByteArray(str) {
	var utf8 = [];
	for (var i = 0; i < str.length; i++) {
		var charcode = str.charCodeAt(i);
		if (charcode < 0x80)
			utf8.push(charcode);
		else if (charcode < 0x800) {
			utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
		} else if (charcode < 0xd800 || charcode >= 0xe000) {
			utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f),
					0x80 | (charcode & 0x3f));
		} else {// surrogate pair
			i++;
			// UTF-16 encodes 0x10000-0x10FFFF by
			// subtracting 0x10000 and splitting the
			// 20 bits of 0x0-0xFFFFF into two halves
			charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str
					.charCodeAt(i) & 0x3ff))
			utf8.push(0xf0 | (charcode >> 18),
					0x80 | ((charcode >> 12) & 0x3f),
					0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
		}
	}
	return utf8;
}

function byteArrayToString(bArray) {
	var result = '';
	for (var i = 0; i < bArray.length; i++) {
		result += String.fromCharCode(parseInt(bArray[i]));
	}
	return result;
}

function xorCipher(content, password, mode) {
	var arrContent = [];

	if (mode === 'e') {
		arrContent = stringToByteArray(content);
	} else {
		arrContent = content;
	}
	var arrPassword = stringToByteArray(password);

	var k = 0;
	var modData = [];
	for (var i = 0; i < arrContent.length; i++) {
		modData[i] = arrContent[i];
		for (var j = 0; j < arrPassword.length; j++) {
			modData[i] ^= arrPassword[j];
		}
	}

	if (mode === 'd') {
		modData = byteArrayToString(modData);
	}

	return modData;
}