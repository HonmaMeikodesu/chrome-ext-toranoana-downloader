const AJAX_TIMEOUT = 5000;

function urlInfo() {
	var startupurl = location.href;
	var elm = $('<a>', { href:startupurl } )[0];
	var params = [];
	var urls = startupurl.split("?");

	// analyze parameters
	if (urls.length > 1) {
		var params = urls[1].split("&");
		for (var i = 0; i < params.length; i++) {
			var keyvalues = params[i].split("=");
			var key = keyvalues[0];
			var value = keyvalues[1];
			params[key] = value;
		}
	}

	// domain
	var domain = elm.protocol + "//" + elm.hostname;
	if (elm.port !== undefined && elm.port !== "") {
		domain = elm.protocol + "//" + elm.hostname + ":" + elm.port;
	}

	// user id
	var userid = "";
	if (p1 !== undefined) {
		userid = p1;
	}
	

	// get xml
	var xml = xmlInfo(params);

	// return URL(optional)
	var returnUrlfunc = function() {
		history.back();
	};

	if (p3 !== undefined) {
		returnUrlfunc = function() {
			if (p3 == "") {
				history.back();
			} else {
				var returnURL = unescape(p3);
				location.href = returnURL;
			}
		};
	}

	// splash screen image(optional)
	var splashImageUrl = "";
	if (splash !== undefined) {
		splashImageUrl = splash;
	}

	var imageUrlfunc = function(img, drm) {
		var url = "/image_php73.php?sp=" + p5 + "&x1=" + img + "&x2=" + drm + "&t=" + getRandom();
		return url;
	}

	if (p1 !== "" && p2 !== "") {
		params["contents"] = p1 + "_" + p2;
	}

	var speed = -1;
	speedtest(function(bps) {
		speed = bps;
	});

	return {
		domain: domain,
		params: params,
		returnUrl: returnUrlfunc,
		imageUrl: imageUrlfunc,
		splashImageUrl: splashImageUrl,
		userid: userid,
		speed: speed,
		bookInfo: xml.bookInfo,
		headerInfo: xml.headerInfo,
		errorInfo: xml.errorInfo,
		minpage: xml.minpage,
		maxpage: xml.maxpage
	};
}

function xmlLoad(xmlurl, sfunc, errorInfo){
	$.ajax({
		url: xmlurl,
		type: 'get',
		dataType: 'xml',
		timeout: 5000,
		async: false
	}).done(function(response, textStatus, jqXHR) {
		sfunc(response, textStatus, jqXHR);
	}).fail(function(jqXHR, textStatus, errorThrown) {
		errorInfo.push(errorDefine("E9999"));
	}).always(function(data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
	});
}

// xml load to json
function xmlInfo(params) {

	var bookall = null;
	var bookInfo = null;
	var headerInfo = null;
	var minpage = 1;
	var maxpage = 9999999999;
	var errorInfo = [];

	if (p6 != "") {
		errorInfo.push(errorDefine(p6));
	}

	// new
	var bookallxmlurl = "/bookinfo_php73.php?" + p5;
	xmlLoad(bookallxmlurl, function(xml, status, xhr) {
		var xc = xhr.getResponseHeader('X-Error-Code');
		var xdef = xhr.getResponseHeader('X-Error-def');
		if (xc != "0") {
			errorInfo.push(errorDefine(xdef));
			return;
		}
		bookall = $.xml2json(xml);
		bookInfo = bookall["bookInfo"];
		headerInfo = bookall["hi"];
	}, errorInfo);

	if (headerInfo != null) {
		maxpage = headerInfo["num"];
		if (params["start"] !== undefined && params["end"] !== undefined) {
			minpage = parseInt(params["start"]);
			maxpage = parseInt(params["end"]);
		}
	}

	if (bookInfo == null) {
		errorInfo.push(errorDefine("E0001"));
	}

	if (headerInfo == null) {
		errorInfo.push(errorDefine("E0001"));
	}

	return {
		minpage: minpage,
		maxpage: maxpage,
		bookInfo: bookInfo,
		headerInfo: headerInfo,
		errorInfo: errorInfo
	};
}

function errorDefine(errorCode) {
	if (ERROR_DEFINE[errorCode] === undefined) {
		return ERROR_DEFINE["E9990"];
	}
	return ERROR_DEFINE[errorCode];
}

var ERROR_DEFINE = {
	"E0000" : {
		code: "0000",
		message: "エラーは存在しません。",
		note: "エラー無しの定義"
	},
	"E0001" : {
		code: "0001",
		message: "有効期限が切れました。再度本棚から閲覧をお願いします。",
		note: "書誌情報取得期限超過"
	},
	"E0002" : {
		code: "0002",
		message: "有効期限が切れました。再度本棚から閲覧をお願いします。",
		note: "パラメータ不正"
	},
	"E0003" : {
		code: "0003",
		message: "有効期限が切れました。再度本棚から閲覧をお願いします。",
		note: "画像取得期限超過"
	},
	"E9990" : {
		code: "9990",
		message: "エラーが発生しました。しばらく経ってから再度お試しください。",
		note: "その他エラー"
	},
	"E9999" : {
		code: "9999",
		message: "通信エラーが発生しました。電波状況のよい場所で再度お試しください。",
		note: "パラメータ不正"
	},
	"E0101" : {
		code: "0101",
		message: "存在しない商品コードです。",
		note: "商品コード不正"
	},
	"E1001" : {
		code: "1001",
		message: "商品を購入していません。",
		note: "商品未購入"
	},
	"E1002" : {
		code: "1002",
		message: "この商品は閲覧できません。",
		note: "閲覧期間外"
	},
	"E1003" : {
		code: "1003",
		message: "エラーが発生しました。しばらく経ってから再度お試しください。",
		note: "TAS連携エラー"
	},
	"E1004" : {
		code: "1004",
		message: "エラーが発生しました。しばらく経ってから再度お試しください。",
		note: "C連携エラー"
	},
};

function warningDefine(code) {
	if (WARNING_DEFINE[code] === undefined) {
		return ERROR_DEFINE["W9990"];
	}
	return WARNING_DEFINE[code];
}

var WARNING_DEFINE = {
	"W5001" : {
		code: "5001",
		message: "通信状態が不安定です。電波のよいところで再度お試しください。",
		note: "電波不安定時警告",
		button1: "再読み込み",
		button2: "ビューア終了"
	},
};

function getRandom() {
	var n = 9999999999;
	return Math.floor(Math.random() * n);
}

function speedtest(callback) {
	var start = (new Date()).getTime();
	$.ajax({
		url: 'dummy',
		type: 'get',
		dataType: 'text',
		timeout: 1000,
		async: false
	}).done(function(data, status, xhr) {
		var end = (new Date()).getTime();
		var sec = (end - start) / 1000;
		var mbps =  (((data.length * 8) / sec) / (1024 * 1024)).toFixed(1);
		callback(mbps);
	}).fail(function(xhr, status, errorThrown) {
		callback(-1);
	}).always(function(data_or_xhr, status, xhr_or_error) {
	});
}

