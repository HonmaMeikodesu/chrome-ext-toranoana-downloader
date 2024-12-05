const NO_JSON_DATA = "no json data";
const DEBUG = false;
const CANVAS_RATIO = 1.0;
var debug_no = 1;
const PC_DEVICE = 0;
const IOS_DEVICE = 1;
const ANDROID_DEVICE = 2;
const RESIZE_WAIT_INTERVAL_MS = 1000;
const JQUERY_POPUP_SUFFIX = "-popup";
const CANVAS_MARGIN = 20;

const DEFAULT_BROWSER = 0;
const CHROME_BROWSER = 1;
const SAKIYOMI = 5;
const SAKIYOMI_FORWARD = 6;
const SAKIYOMI_BACK = 4;
const SAKIYOMI_RETRIES = 2;
const COPYIMG_RETRY_TIMES = 10;
const COPYIMG_RETRY_WAIT = 500;
const IMGDL_RETRY_TIMES = 3;
const MAX_SCALE = 3;
const MIN_SCALE = 1;

// for new
const DOUBLE_TAP_WAIT_TIME = 300;
var pagingInPinching = false;
var showMenuFlag = false;
var isPinching = false;
var waitDoubleTap = false;
var backForwardButtonEventCreated = false;
// for new end

var currentPage = 1;
var startUp = true;
var firstTime = false;

var preloadNum = 1;
var resizeTimer = null;
var resizeWait = 200;
var xmlHttpObj = null;
var dispBookmark = true;
var displayPopup = null;
var rotateKeepPopup = null;
var onRotateFunc = null;
var onRotateRevertFunc = null;
var hideRotateMenu = 0;
var enableDefaultTouchEvent = false;
var deviceType = PC_DEVICE;
var deviceType2 = PC_DEVICE;
var initOrientation = 0;
var isUnread = true;
var _isTimeout = false;
var retryPageError3 = false;
var showPage6 = false;
var showPage8 = false;
var dispPage = 0;
var dispFont = 0;
var isFirst = true;

var page3Bookmarks_num = 0;
var page4Bookmarks_del_num = 0;
var android2 = false;

var currentPage = 1;
var _currentPage = currentPage;
var fontSizes = {
	1: "small",
	2: "middle",
	3: "large",
	4: "img"
};
var fontSize = 2;

var current_images = new Array();
var next_images = new Array();
var prev_images = new Array();

var S2 = false;
var filesize = 0;

// add zantei
var agent = navigator.userAgent;
var browserType = DEFAULT_BROWSER;
var showPage8Flag = false;
var needsRotateOpenPopUp = false;
var needsPageAnimation = false;
var resizeFadeInTimerId = null;
var resizeKeepPopupOpenTimerId = null;
var currentPage = 1;
var _currentPage = currentPage;
var fontSizes = {
	1: "small",
	2: "middle",
	3: "large",
	4: "img"
};
var fontSize = 2;
var _fontSize = fontSize;
var i = 0;
var pattern = new RegExp("\\{" + (i - 1) + "\\}", "g");
var requestNext = null;
var requestPrev = null;
var actStatusNext = 0;
var actStatusPrev = 0;
var currentImage = null;
var page3_unselectedAction = true;
var page4_unselectedAction = true;

var urlinfo = {};
var pi = {};
var headerInfo = {};
var bookInfo = {};
var errorInfo = {};
var orgDomain = "";
var splashImageUrl = "";
var sequencialDownloader = null;

var isApple = false;

$(document).ready(function() {

	urlinfo = urlInfo();
	headerInfo = urlinfo.headerInfo;
	bookInfo = urlinfo.bookInfo;
	errorInfo = urlinfo.errorInfo;
	orgDomain = urlinfo.domain;
	splashImageUrl = urlinfo.splashImageUrl;

	// splash
/*
	if (splashImageUrl !== "") {
		loadSplashImage(splashImageUrl);
	}
*/
	// xml load error
	if (headerInfo == null || bookInfo == null) {
		return;
	}

	pi = pageInfo();

	// menu-slider
	initializeMenuSlider();

	/* move to global
	var startUp = true;
	var firstTime = false;

	var preloadNum = 1;
	var resizeTimer = null;
	var resizeWait = 200;
	var xmlHttpObj = null;
	var dispBookmark = true;
	var displayPopup = null;
	var rotateKeepPopup = null;
	var onRotateFunc = null;
	var onRotateRevertFunc = null;
	var hideRotateMenu = 0;
	var enableDefaultTouchEvent = false;
	var deviceType = PC_DEVICE;
	var isUnread = true;
	var _isTimeout = false;
	var retryPageError3 = false;
	var showPage6 = false;
	var showPage8 = false;
	var dispPage = 0;
	var dispFont = 0;
	var isFirst = true;
	*/

	setCacheFlag = false;

	isApple = isAppleDevice();

	var agent = navigator.userAgent;
	if (-1 != agent.search(/iPhone/)) {
		deviceType = IOS_DEVICE;
	} else if (-1 != agent.search(/iPad/)) {
		deviceType = IOS_DEVICE;
	} else if (-1 != agent.search(/Android/)) {
		deviceType = ANDROID_DEVICE;
	}
	deviceType2 = deviceType;
	initOrientation = getOrientation();

	// zantei
	if (deviceType == IOS_DEVICE) {
		deviceType = PC_DEVICE;
	}

	var browserType = DEFAULT_BROWSER;
	if (-1 != agent.toLowerCase().search(/chrome/)) {
		browserType = CHROME_BROWSER;
	}

	if (deviceType2 == PC_DEVICE) {
		$("body").css("overflow-y", "hidden");
	}

	// move to global
	//var android2 = false;
	//var S2 = false;
	var showPage8Flag = false;
	if (deviceType == ANDROID_DEVICE) {
		if ((agent.search(/Android 2/) != -1)) {
			android2 = true;
			$("#loadingicon").css("display", "none");
			$("#loadingicon").html('<img src="image/loadingicon.gif" />');
		} else if ((agent.search(/Android 3/) != -1)) {
			showPage8Flag = true;
			$("body").css("overflow", "hidden");
		} else if ((agent.search(/Android 4.0/) != -1)) {
			showPage8Flag = true;
			$("body").css("overflow", "hidden");
		} else {
			$("body").css("overflow", "hidden");
		}

		if ((agent.search(/SC-02C/) != -1)) {
			S2 = true;
			android2 = true;
			$("#loadingicon").css("display", "none");
			$("#loadingicon").html('<img src="image/loadingicon.gif" />');
		}
	}


	setPopUpDialogCallback();

	$("#navbox_page6_img").attr("src", "image/b_03_icon05.png");

	if (bookInfo["contentType"] != 1) {
		$("#navbox_page2_img").attr("src", "image/b_03_icon01.png");
	}

	//var needsRotateOpenPopUp = false;
	//var needsPageAnimation = false;
	$(window).bind('orientationchange', function(e) {
		//
		// iframe内でビューアが動作する前提とすると
		// iOSで横向きの時に高さが取得できないため
		// 回転検知->親フレームでiframe内の高さを再設定->resizeイベントで高さ取得
		// の動作とする

/* resizeに処理があるためコメントアウト
		needsRotateOpenPopUp = true;
		needsPageAnimation = true;
		var wh = Size.height();

		debuglog("orientationchange wh = " + wh);

		// for contents
		if (deviceType2 == IOS_DEVICE) {
			$("#page1_content").css("height", wh + "px");
			$("#page1").css("height", wh + "px");

			// for body
			$("body").css("height", wh + "px");
		}

		// popup re-center
		if (displayPopup != null) {
			popUpCenterPosition(displayPopup);
		}
*/
	});


	var resizeFadeInTimerId = null;
	var resizeKeepPopupOpenTimerId = null;

	$("#headerbox_align").css('text-align', 'left');
	//$("#headerbox_title").text(bookInfo["title"]);
	$("#headerbox_title").text("");

	// move to global
	/* start
	var currentPage = 1;
	var _currentPage = currentPage;

	var fontSizes = {1: "small", 2: "middle", 3: "large", 4: "img"};

	var fontSize = 2;
	//end
	*/

	if (bookInfo["contentType"] == 2) fontSize = 4;
	var _fontSize = fontSize;

	/*
	var h = function(str) {
	if (str !== null) {
	str = str.toString();
	str = str.replace(/&/g, "&amp;");
	str = str.replace(/</g, "&lt;");
	str = str.replace(/>/g, "&gt;");
	}
	else str = "";
	return str;
	}
	*/

	/*
	var printf = function(format) {
	for (var i=1; i<arguments.length; i++) {
	var pattern = new RegExp("\\{" + (i-1) + "\\}", "g");
	format = format.replace(pattern, h(arguments[i]));
	}
	return format;
	}
	*/

	var requestNext = null;
	var requestPrev = null;

	var actStatusNext = 0;
	var actStatusPrev = 0;

	// move to global
	//var current_images = new Array();
	//var next_images = new Array();
	//var prev_images = new Array();
	//var filesize = 0;

	current_images[0] = {
		"page": 0,
		"status": false,
		"image": null,
		"docode1": "",
		"decode2": null,
		"mime": ""
	};

	/*
	for (var i=0; i<SAKIYOMI; i++) {
	next_images[i] = {"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""};
	prev_images[i] = {"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""};
	}
	*/

	var currentImage = null;
	var imgLoadXmlHttpObj = null;

	/*
	var bookmarks = function() {

	var bookmarks = localStorage.getItem(CONTENTS_ROOT_PATH + "/bookmarks/");
	if (bookmarks === null) {
	bookmarks = [];
	bookmarks[0] = null;
	bookmarks[1] = null;
	bookmarks[2] = null;
	bookmarks[3] = null;
	}
	else bookmarks = JSON.parse(bookmarks);
	return bookmarks;
	}

	var unread = function() {

	var unread = localStorage.getItem(CONTENTS_ROOT_PATH + "/unread/");
	if (unread === null) {
	unread = null;
	}
	else unread = JSON.parse(unread);
	return unread;
	}
	*/

	var loadingiconShow = false;

	$("#page0_button1").bind("tap", function() {
		isFirst = true;
		$("#page0").popup("close");
		redrawWithResize();
		firstPage();
	});

	$("#page0_button2").bind("tap", function() {
		isFirst = false;
		$("#page0").popup("close");
		redrawWithResize();
		continuePage();
	});

	// 元々pageshowを使っていたが、意味的にpageinitに切り替えた
	$("#page1").on("pageshow", function() {});
	$("#page1").on("pageinit", function() {

		// 自動しおりが存在した場合に、#page0ダイアログを表示する
		var _bookmarks = bookmarks();
		if (0 in _bookmarks) {
			if (_bookmarks[0] !== null && dispBookmark) {
				bindResizeWindow();
				setTimeout(function() {
					if (startUp) {
						$("#page0").popup("open");
						displayPopup = $("#page0" + JQUERY_POPUP_SUFFIX);
					}
				}, 500);
			} else {
				bindResizeWindow();
				setTimeout(function() {
					if (startUp) {
						firstTime = true;
						loadImage(currentPage, fontSize, false, false);
					}
				}, 500);
				dispBookmark = true;
			}
		}

	});

	$("#navbox_page2").bind("tap", function(e) {
		e.preventDefault();
		e.stopPropagation();

		if (bookInfo["contentType"] == 1) {

			unVisibleNavi();

			$("#headerbox_align").css('text-align', 'center');
			$("#headerbox_title").text("文字サイズ変更");

			switch (fontSize) {
				case 1:
					$("#page2Small").attr("checked", true);
					break;
				case 2:
					$("#page2Middle").attr("checked", true);
					break;
				case 3:
					$("#page2Large").attr("checked", true);
					break;
				default:
					break;
			}

			$("#page2").popup("open");
		}
	});

	$("#page2_close").bind("tap", function() {
		$("#page2").popup("close");
	});

	$("#page2Large_base").bind("tap", function() {
		$("#page2Large").attr("checked", true);
		_fontSize = 3;
	});

	$("#page2Middle_base").bind("tap", function() {
		$("#page2Middle").attr("checked", true);
		_fontSize = 2;
	});

	$("#page2Small_base").bind("tap", function() {
		$("#page2Small").attr("checked", true);
		_fontSize = 1;
	});

	var fontSizeRequested = false;
	$("#page2_button").bind("tap", function(e) {
		fontSizeRequested = true;
		$("#page2").popup("close");

		if (fontSize == _fontSize) {
			return;
		}
		_loadingiconShow(e);

		setTimeout(function() {
			//var flowID = headerInfo["pgs"]["pg"][currentPage - 1]["id"];
			//var startOffset = headerInfo["pgs"]["pg"][currentPage - 1]["s"];
			var info = getTargetHeaderInfo(currentPage - 1);
			var flowID = info["id"];
			var startOffset = info["s"];
			var _headerInfo = urlinfo.params["contents"] + "/img/header.xml";

			if (null == xmlHttpObj) {
				xmlHttpObj = createXMLHttpRequest();
			}
			xmlHttpObj.open("GET", _headerInfo, false);
			xmlHttpObj.onreadystatechange = function() {

				if (xmlHttpObj.readyState == 4) {
					if (xmlHttpObj.status == 200) {
						_isTimeout = false;

						headerInfo = eval("(" + xmlHttpObj.responseText + ")");

						if (headerInfo == false) {
							$("#pageError_message").html("【102】コンテンツの取得に<br />失敗しました。");
							$("#pageError").popup("open");

							return false;
						} else {
							var i = 0;
							for (i; i < headerInfo.pgs.pg.length; i++) {
								if (flowID == parseInt(headerInfo.pgs.pg[i].id)) {
									if (parseInt(headerInfo.pgs.pg[i].s) <= parseInt(startOffset) && parseInt(startOffset) <= parseInt(headerInfo.pgs.pg[i].e)) {

										setTimeout(function() {
											loadImage(parseInt(headerInfo.pgs.pg[i].n), _fontSize, false, true, e);
										}, 300);

										break;
									}
								}
							}
						}
					} else {
						_isTimeout = true;

						fontSizeRequested = false;

						dispFont = _fontSize;

						$("#headerbox_align").css('text-align', 'left');
						//$("#headerbox_title").text(bookInfo["title"]);
						$("#headerbox_title").text("");

						_loadingiconHide();
						$("#pageError3_message").text("【91-5】通信に失敗しました。");
						$("#pageError3").popup("open");

						return false;
					}
				}
				fontSizeRequested = false;
			}
			xmlHttpObj.send(null);
		}, 300);
	});

	// back button tap
	$("#navbox_page_back").bind("tap", function(e) {
		e.preventDefault();
		e.stopPropagation();
		unVisibleNavi();

		//alert("close viewer");
		//history.back();
		//window.parent.postMessage("viewerfinish", orgDomain);
		urlinfo.returnUrl();
	});

	// move to global
	//var page3Bookmarks_num = 0;
	var page3_unselectedAction = true;

	$("#navbox_page3").bind("tap", function(e) {
		e.preventDefault();
		e.stopPropagation();
		unVisibleNavi();

		// for ios
		setPage1Height();

		$("#headerbox_align").css('text-align', 'center');
		$("#headerbox_title").text("しおりをはさむ");

		page3Bookmarks_num = 0;

		var _bookmarks = bookmarks();
		var _html = printf("しおり {0}（未使用）", 1);
		if (1 in _bookmarks) {
			if (_bookmarks[1] !== null) {
				var _fontSizes = {
					1: "：小",
					2: "：中",
					3: "：大",
					4: ""
				};
				var _html = printf("しおり {0}（{1}{2}）", 1, parseInt(_bookmarks[1]["page"]), _fontSizes[parseInt(_bookmarks[1]["size"])]);
			}
		}
		$("#page3_bookmarks1").html(_html);
		var _html = printf("しおり {0}（未使用）", 2);
		if (2 in _bookmarks) {
			if (_bookmarks[2] !== null) {
				var _fontSizes = {
					1: "：小",
					2: "：中",
					3: "：大",
					4: ""
				};
				var _html = printf("しおり {0}（{1}{2}）", 2, parseInt(_bookmarks[2]["page"]), _fontSizes[parseInt(_bookmarks[2]["size"])]);
			}
		}
		$("#page3_bookmarks2").html(_html);
		var _html = printf("しおり {0}（未使用）", 3);
		if (3 in _bookmarks) {
			if (_bookmarks[3] !== null) {
				var _fontSizes = {
					1: "：小",
					2: "：中",
					3: "：大",
					4: ""
				};
				var _html = printf("しおり {0}（{1}{2}）", 3, parseInt(_bookmarks[3]["page"]), _fontSizes[parseInt(_bookmarks[3]["size"])]);
			}
		}
		$("#page3_bookmarks3").html(_html);

		$("#page3").popup("open");
	});

	$("#page3_close").bind("tap", function() {
		$("#page3").popup("close");
	});

	$("#page3").on("popupafterclose", function() {
		displayPopup = null;
		if (page3Bookmarks_num != 0) {
			$("#page3_dialog_message").text("「しおり" + page3Bookmarks_num + "」を上書きしますか");

			page3_unselectedAction = true;

			setTimeout(function() {
				$("#page3_dialog").popup("open");
			}, 300);
		}
	});

	$("#page3_bookmarks1").bind("tap", function() {
		var _bookmarks = bookmarks();
		if (_bookmarks[1] !== null) {
			page3Bookmarks_num = 1;

			$("#page3").popup("close");
		} else {
			setBookmarks(1);

			$("#page3").popup("close");
		}
	});
	$("#page3_bookmarks2").bind("tap", function() {
		var _bookmarks = bookmarks();
		if (_bookmarks[2] !== null) {
			page3Bookmarks_num = 2;

			$("#page3").popup("close");
		} else {
			setBookmarks(2);

			$("#page3").popup("close");
		}
	});
	$("#page3_bookmarks3").bind("tap", function() {
		var _bookmarks = bookmarks();
		if (_bookmarks[3] !== null) {
			page3Bookmarks_num = 3;

			$("#page3").popup("close");
		} else {
			setBookmarks(3);

			$("#page3").popup("close");
		}
	});

	$("#page3_dialog_button1").bind("tap", function() {
		var _bookmarks = bookmarks();
		if (_bookmarks[page3Bookmarks_num] !== null) {
			setBookmarks(page3Bookmarks_num);

		}
		page3_unselectedAction = false;
		page3Bookmarks_num = 0;

		$("#page3_dialog").popup("close");
	});

	$("#page3_dialog_button2").bind("tap", function() {
		page3_unselectedAction = true;
		// いいえでもダイアログの再表示はしない
		page3Bookmarks_num = 0;
		$("#page3_dialog").popup("close");
	});

	// move to global
	//var page4Bookmarks_del_num = 0;
	var page4_unselectedAction = true;

	$("#navbox_page4").bind("tap", function(e) {
//		alert("body.height = " + $("body").css("height"));
//		alert("page1.height = " + $("#page1").css("height"));
//		alert("page1.min-height = " + $("#page1").css("min-height"));
//		alert("page1_cotent.height = " + $("#page1_content").css("height"));
		e.preventDefault();
		e.stopPropagation();
		unVisibleNavi();

		// for ios
		setPage1Height();

		$("#headerbox_align").css('text-align', 'center');
		$("#headerbox_title").text("しおりをひらく");

		page4Bookmarks_del_num = 0;

		var _bookmarks = bookmarks();
		var _html = printf("しおり {0}<br />しおりはありません", 1);

		$("#page4_bookmarks1_del").hide();

		if (1 in _bookmarks) {
			if (_bookmarks[1] !== null) {
				var _fontSizes = {
					1: "：小",
					2: "：中",
					3: "：大",
					4: ""
				};
				var _html = printf("しおり {0}<br />{1}　{2}{3}", 1, _bookmarks[1]["date"], parseInt(_bookmarks[1]["page"]), _fontSizes[parseInt(_bookmarks[1]["size"])]);

				$("#page4_bookmarks1_del").show();
			}
		}
		$("#page4_bookmarks1").html(_html);
		var _html = printf("しおり {0}<br />しおりはありません", 2);

		$("#page4_bookmarks2_del").hide();

		if (2 in _bookmarks) {
			if (_bookmarks[2] !== null) {
				var _fontSizes = {
					1: "：小",
					2: "：中",
					3: "：大",
					4: ""
				};
				var _html = printf("しおり {0}<br />{1}　{2}{3}", 2, _bookmarks[2]["date"], parseInt(_bookmarks[2]["page"]), _fontSizes[parseInt(_bookmarks[2]["size"])]);

				$("#page4_bookmarks2_del").show();
			}
		}
		$("#page4_bookmarks2").html(_html);
		var _html = printf("しおり {0}<br />しおりはありません", 3);

		$("#page4_bookmarks3_del").hide();

		if (3 in _bookmarks) {
			if (_bookmarks[3] !== null) {
				var _fontSizes = {
					1: "：小",
					2: "：中",
					3: "：大",
					4: ""
				};
				var _html = printf("しおり {0}<br />{1}　{2}{3}", 3, _bookmarks[3]["date"], parseInt(_bookmarks[3]["page"]), _fontSizes[parseInt(_bookmarks[3]["size"])]);

				$("#page4_bookmarks3_del").show();
			}
		}
		$("#page4_bookmarks3").html(_html);


		$("#page4").popup("open");
	});

	$("#page4_close").bind("tap", function() {
		$("#page4").popup("close");
	});

	$("#page4").on("popupafterclose", function() {
		displayPopup = null;
		if (page4Bookmarks_del_num != 0) {
			$("#page4_dialog_message").text("「しおり" + page4Bookmarks_del_num + "」を削除しますか");

			page4_unselectedAction = true;

			setTimeout(function() {
				$("#page4_dialog").popup("open");
			}, 1000);
		}
	});

	$("#page4_bookmarks1").bind("tap", function(e) {

		var _bookmarks = bookmarks();
		if (_bookmarks[1] !== null) {
			_loadingiconShow(e);
			$("#page4").popup("close");
			if (fontSize == parseInt(_bookmarks[1]["size"])) {
				setTimeout(function() {
					loadImage(parseInt(_bookmarks[1]["page"]), parseInt(_bookmarks[1]["size"]), false, false, e);
				}, 300);
			} else {
				setTimeout(function() {
					var _headerInfo = urlinfo.params["contents"] + "/img/header.xml";

					if (null == xmlHttpObj) {
						xmlHttpObj = createXMLHttpRequest();
					}
					xmlHttpObj.open("GET", _headerInfo, false);
					xmlHttpObj.onreadystatechange = function() {
						if (xmlHttpObj.readyState == 4) {
							if (xmlHttpObj.status == 200) {
								_isTimeout = false;
								var res = eval("(" + xmlHttpObj.responseText + ")");
								if (res == false) {
									$("#pageError_message").html("【102】コンテンツの取得に<br />失敗しました。");
									$("#pageError").popup("open");

									return false;
								} else {
									var flowID = res["pgs"]["pg"][parseInt(_bookmarks[1]["page"]) - 1]["id"];
									var startOffset = res["pgs"]["pg"][parseInt(_bookmarks[1]["page"]) - 1]["s"];

									var i = 0;
									for (i; i < headerInfo.pgs.pg.length; i++) {
										if (flowID == parseInt(headerInfo.pgs.pg[i].id)) {
											if (parseInt(headerInfo.pgs.pg[i].s) <= parseInt(startOffset) && parseInt(startOffset) <= parseInt(headerInfo.pgs.pg[i].e)) {

												_loadingiconShow(e);

												setTimeout(function() {
													loadImage(parseInt(headerInfo.pgs.pg[i].n), fontSize, false, false, e);
												}, 300);

												break;
											}
										}
									}
								}
							} else {
								_isTimeout = true;

								fontSizeRequested = false;

								dispFont = _fontSize;

								$("#headerbox_align").css('text-align', 'left');
								//$("#headerbox_title").text(bookInfo["title"]);
								$("#headerbox_title").text("");

								_loadingiconHide();
								$("#pageError3_message").text("【91-6】通信に失敗しました。");
								$("#pageError3").popup("open");

								return false;
							}
						}
					}
					xmlHttpObj.send(null);
				}, 300);
			}
		}
	});
	$("#page4_bookmarks2").bind("tap", function(e) {

		var _bookmarks = bookmarks();
		if (_bookmarks[2] !== null) {
			_loadingiconShow(e);
			$("#page4").popup("close");
			if (fontSize == parseInt(_bookmarks[2]["size"])) {
				setTimeout(function() {
					loadImage(parseInt(_bookmarks[2]["page"]), parseInt(_bookmarks[2]["size"]), false, false, e);
				}, 300);
			} else {
				setTimeout(function() {
					var _headerInfo = urlinfo.params["contents"] + "/img/header.xml";

					if (null == xmlHttpObj) {
						xmlHttpObj = createXMLHttpRequest();
					}
					xmlHttpObj.open("GET", _headerInfo, false);
					xmlHttpObj.onreadystatechange = function() {
						if (xmlHttpObj.readyState == 4) {
							if (xmlHttpObj.status == 200) {
								_isTimeout = false;
								var res = eval("(" + xmlHttpObj.responseText + ")");
								if (res == false) {
									$("#pageError_message").html("【102】コンテンツの取得に<br />失敗しました。");
									$("#pageError").popup("open");

									return false;
								} else {
									var flowID = res["pgs"]["pg"][parseInt(_bookmarks[2]["page"]) - 1]["id"];
									var startOffset = res["pgs"]["pg"][parseInt(_bookmarks[2]["page"]) - 1]["s"];

									var i = 0;
									for (i; i < headerInfo.pgs.pg.length; i++) {
										if (flowID == parseInt(headerInfo.pgs.pg[i].id)) {
											if (parseInt(headerInfo.pgs.pg[i].s) <= parseInt(startOffset) && parseInt(startOffset) <= parseInt(headerInfo.pgs.pg[i].e)) {

												_loadingiconShow(e);

												setTimeout(function() {
													loadImage(parseInt(headerInfo.pgs.pg[i].n), fontSize, false, false, e);
												}, 300);

												break;
											}
										}
									}
								}
							} else {
								_isTimeout = true;

								fontSizeRequested = false;

								dispFont = _fontSize;

								$("#headerbox_align").css('text-align', 'left');
								//$("#headerbox_title").text(bookInfo["title"]);
								$("#headerbox_title").text("");

								_loadingiconHide();
								$("#pageError3_message").text("【91-7】通信に失敗しました。");
								$("#pageError3").popup("open");

								return false;
							}
						}
					}
					xmlHttpObj.send(null);
				}, 300);
			}
		}
	});
	$("#page4_bookmarks3").bind("tap", function(e) {

		var _bookmarks = bookmarks();
		if (_bookmarks[3] !== null) {
			_loadingiconShow(e);
			$("#page4").popup("close");
			if (fontSize == parseInt(_bookmarks[3]["size"])) {
				setTimeout(function() {
					loadImage(parseInt(_bookmarks[3]["page"]), parseInt(_bookmarks[3]["size"]), false, false, e);
				}, 300);
			} else {
				setTimeout(function() {
					var _headerInfo = urlinfo.params["contents"] + "/img/header.xml";

					if (null == xmlHttpObj) {
						xmlHttpObj = createXMLHttpRequest();
					}
					xmlHttpObj.open("GET", _headerInfo, false);
					xmlHttpObj.onreadystatechange = function() {
						if (xmlHttpObj.readyState == 4) {
							if (xmlHttpObj.status == 200) {
								_isTimeout = false;
								var res = eval("(" + xmlHttpObj.responseText + ")");
								if (res == false) {
									$("#pageError_message").html("【102】コンテンツの取得に<br />失敗しました。");
									$("#pageError").popup("open");

									return false;
								} else {
									var flowID = res["pgs"]["pg"][parseInt(_bookmarks[3]["page"]) - 1]["id"];
									var startOffset = res["pgs"]["pg"][parseInt(_bookmarks[3]["page"]) - 1]["s"];

									var i = 0;
									for (i; i < headerInfo.pgs.pg.length; i++) {
										if (flowID == parseInt(headerInfo.pgs.pg[i].id)) {
											if (parseInt(headerInfo.pgs.pg[i].s) <= parseInt(startOffset) && parseInt(startOffset) <= parseInt(headerInfo.pgs.pg[i].e)) {

												_loadingiconShow(e);

												setTimeout(function() {
													loadImage(parseInt(headerInfo.pgs.pg[i].n), fontSize, false, false, e);
												}, 300);

												break;
											}
										}
									}
								}
							} else {
								_isTimeout = true;

								fontSizeRequested = false;

								dispFont = _fontSize;

								$("#headerbox_align").css('text-align', 'left');
								//$("#headerbox_title").text(bookInfo["title"]);
								$("#headerbox_title").text("");

								_loadingiconHide();
								$("#pageError3_message").text("【91-8】通信に失敗しました。");
								$("#pageError3").popup("open");

								return false;
							}
						}
					}
					xmlHttpObj.send(null);
				}, 300);
			}
		}
	});

	$("#page4_bookmarks1_del").bind("tap", function() {
		var _bookmarks = bookmarks();
		if (_bookmarks[1] !== null) {
			page4Bookmarks_del_num = 1;

			$("#page4").popup("close");

		}
	});
	$("#page4_bookmarks2_del").bind("tap", function() {
		var _bookmarks = bookmarks();
		if (_bookmarks[2] !== null) {
			page4Bookmarks_del_num = 2;

			$("#page4").popup("close");

		}
	});
	$("#page4_bookmarks3_del").bind("tap", function() {
		var _bookmarks = bookmarks();
		if (_bookmarks[3] !== null) {
			page4Bookmarks_del_num = 3;

			$("#page4").popup("close");

		}
	});

	$("#page4_dialog_button1").bind("tap", function() {
		var _bookmarks = bookmarks();
		if (_bookmarks[page4Bookmarks_del_num] !== null) {

			_bookmarks[page4Bookmarks_del_num] = null;
			_bookmarks = JSON.stringify(_bookmarks);
			//localStorage.setItem(CONTENTS_ROOT_PATH + "/bookmarks/", _bookmarks);
			localStorage.setItem(pi.bookmarkpath, _bookmarks);

			var _html = printf("しおり {0}<br />しおりはありません", page4Bookmarks_del_num);
			$("#page4_bookmarks" + page4Bookmarks_del_num).html(_html);
		}

		page4_unselectedAction = false;
		page4Bookmarks_del_num = 0;

		$("#page4_dialog").popup("close");
	});

	$("#page4_dialog_button2").bind("tap", function() {
		page4_unselectedAction = true;
		// いいえでもダイアログ再表示はしない
		page4Bookmarks_del_num = 0;
		$("#page4_dialog").popup("close");
	});

	$("#navbox_page5").bind("tap", function(e) {
		e.preventDefault();
		e.stopPropagation();
		unVisibleNavi();

		// for ios
		setPage1Height();

		$("#headerbox_align").css('text-align', 'center');
		$("#headerbox_title").text("ページ移動バー");

		var info = getTargetHeaderInfo(pi.realPage(1));
		//if (headerInfo["pgs"]["pg"][pi.realPage(1)]["d"] == 1) {
		//if (info["d"] == 1) {
		if (pi.direction == 1) {
			$("#page5_right").show();
			$("#page5_left").hide();
		//} else if (headerInfo["pgs"]["pg"][0]["d"] == 2) {
		//} else if (headerInfo["pgs"]["pg"][pi.realPage(1)]["d"] == 2) {
		//} else if (info["d"] == 2) {
		} else if (pi.direction == 2) {
			$("#page5_right").hide();
			$("#page5_left").show();
		} else {
			$("#page5_right").show();
			$("#page5_left").hide();
		}

		//$("#page5_slider").attr("max", parseInt(headerInfo["num"]));
		$("#page5_slider").attr("max", parseInt(pi.end));

		if (currentPage != _currentPage) _currentPage = currentPage;

		//var page5_num = _currentPage + "/" + parseInt(headerInfo["num"]);
		var page5_num = _currentPage + "/" + parseInt(pi.end);
		$("#page5_num").text(page5_num);


		$("#page5_slider").bind("change", page5_slider_event);

		var info = getTargetHeaderInfo(pi.realPage(1));
		//if (headerInfo["pgs"]["pg"][0]["d"] == 1) {
		//if (headerInfo["pgs"]["pg"][pi.realPage(1)]["d"] == 1) {
		//if (info["d"] == 1) {
		if (pi.direction == 1) {
			//$("#page5_slider").attr("value", parseInt(headerInfo["num"]) - (_currentPage - 1));
			$("#page5_slider").attr("value", parseInt(pi.end) - (_currentPage - 1));
		//} else if (headerInfo["pgs"]["pg"][0]["d"] == 2) {
		//} else if (headerInfo["pgs"]["pg"][pi.realPage(1)]["d"] == 2) {
		//} else if (info["d"] == 2) {
		} else if (pi.direction == 2) {
			$("#page5_slider").attr("value", _currentPage);
		}

		$("#page5_slider").slider("refresh");


		var _flag = true;

		var _unread = unread();
		if (_unread !== null) _flag = _unread["flag"];

		if (_flag == true) {
			$("#page5_button1").show();
			$("#page5_function_area").css("width", "126px");
		} else {
			$("#page5_button1").hide();
			$("#page5_function_area").css("width", "63px");
		}

		$("#page5").popup("open");
	});

	$("#page5_close").bind("tap", function() {
		$("#page5").popup("close");
	});

	$("#page5_top").bind("tap", function() {
		_currentPage = 1;

		//var page5_num = _currentPage + "/" + parseInt(headerInfo["num"]);
		var page5_num = _currentPage + "/" + parseInt(pi.end);
		$("#page5_num").text(page5_num);

		//$("#page5_slider").attr("value", parseInt(headerInfo["num"]));
		$("#page5_slider").attr("value", parseInt(pi.end));

		$("#page5_slider").slider("refresh");
	});

	$("#page5_left_top").bind("tap", function() {
		_currentPage = 1;

		//var page5_num = _currentPage + "/" + parseInt(headerInfo["num"]);
		var page5_num = _currentPage + "/" + parseInt(pi.end);
		$("#page5_num").text(page5_num);

		$("#page5_slider").attr("value", _currentPage);

		$("#page5_slider").slider("refresh");
	});

	$("#page5_prev").bind("tap", function() {
		if (_currentPage > 1) _currentPage--;

		//var page5_num = _currentPage + "/" + parseInt(headerInfo["num"]);
		var page5_num = _currentPage + "/" + parseInt(pi.end);
		$("#page5_num").text(page5_num);

		//$("#page5_slider").attr("value", parseInt(headerInfo["num"]) - (_currentPage - 1));
		$("#page5_slider").attr("value", parseInt(pi.end) - (_currentPage - 1));

		$("#page5_slider").slider("refresh");
	});

	$("#page5_left_prev").bind("tap", function() {
		if (_currentPage > 1) _currentPage--;

		//var page5_num = _currentPage + "/" + parseInt(headerInfo["num"]);
		var page5_num = _currentPage + "/" + parseInt(pi.end);
		$("#page5_num").text(page5_num);

		$("#page5_slider").attr("value", _currentPage);

		$("#page5_slider").slider("refresh");
	});

	$("#page5_next").bind("tap", function() {
		//if (_currentPage < parseInt(headerInfo["num"])) _currentPage++;
		if (_currentPage < parseInt(pi.end)) _currentPage++;

		//var page5_num = _currentPage + "/" + parseInt(headerInfo["num"]);
		var page5_num = _currentPage + "/" + parseInt(pi.end);
		$("#page5_num").text(page5_num);

		//$("#page5_slider").attr("value", parseInt(headerInfo["num"]) - (_currentPage - 1));
		$("#page5_slider").attr("value", parseInt(pi.end) - (_currentPage - 1));

		$("#page5_slider").slider("refresh");
	});

	$("#page5_left_next").bind("tap", function() {
		//if (_currentPage < parseInt(headerInfo["num"])) _currentPage++;
		if (_currentPage < parseInt(pi.end)) _currentPage++;

		//var page5_num = _currentPage + "/" + parseInt(headerInfo["num"]);
		var page5_num = _currentPage + "/" + parseInt(pi.end);
		$("#page5_num").text(page5_num);

		$("#page5_slider").attr("value", _currentPage);

		$("#page5_slider").slider("refresh");
	});

	$("#page5_end").bind("tap", function() {
		//_currentPage = parseInt(headerInfo["num"]);
		_currentPage = parseInt(pi.end);

		//var page5_num = _currentPage + "/" + parseInt(headerInfo["num"]);
		var page5_num = _currentPage + "/" + parseInt(pi.end);
		$("#page5_num").text(page5_num);

		$("#page5_slider").attr("value", 1);

		$("#page5_slider").slider("refresh");
	});

	$("#page5_left_end").bind("tap", function() {
		//_currentPage = parseInt(headerInfo["num"]);
		_currentPage = parseInt(pi.end);

		//var page5_num = _currentPage + "/" + parseInt(headerInfo["num"]);
		var page5_num = _currentPage + "/" + parseInt(pi.end);
		$("#page5_num").text(page5_num);

		$("#page5_slider").attr("value", _currentPage);

		$("#page5_slider").slider("refresh");
	});

	$("#page5_button1").bind("tap", function(e) {

		var _unread = unread();
		if (_unread !== null) {
			if (fontSize == parseInt(_unread["size"])) {

				$("#page5").popup("close");

				_loadingiconShow(e);

				setTimeout(function() {
					loadImage(parseInt(_unread["page"]), parseInt(_unread["size"]), false, false, e);
				}, 300);
			} else {
				var _headerInfo = urlinfo.params["contents"] + "/img/header.xml";

				if (null == xmlHttpObj) {
					xmlHttpObj = createXMLHttpRequest();
				}
				xmlHttpObj.open("GET", _headerInfo, false);
				xmlHttpObj.onreadystatechange = function() {
					if (xmlHttpObj.readyState == 4) {
						if (xmlHttpObj.status == 200) {
							var res = eval("(" + xmlHttpObj.responseText + ")");

							var flowID = res["pgs"]["pg"][parseInt(_unread["page"]) - 1]["id"];
							var startOffset = res["pgs"]["pg"][parseInt(_unread["page"]) - 1]["s"];

							var i = 0;
							for (i; i < headerInfo.pgs.pg.length; i++) {
								if (flowID == parseInt(headerInfo.pgs.pg[i].id)) {
									if (parseInt(headerInfo.pgs.pg[i].s) <= parseInt(startOffset) && parseInt(startOffset) <= parseInt(headerInfo.pgs.pg[i].e)) {

										$("#page5").popup("close");

										_loadingiconShow(e);

										setTimeout(function() {
											loadImage(parseInt(headerInfo.pgs.pg[i].n), fontSize, false, false, e);
										}, 300);

										break;
									}
								}
							}
						} else {
							return false;
						}
					}
				}
				xmlHttpObj.send(null);
			}
		}
	});

	$("#page5_button2").bind("tap", function(e) {
		var info = getTargetHeaderInfo(pi.realPage(1));
		//if (headerInfo["pgs"]["pg"][0]["d"] == 2) {}
		//if (headerInfo["pgs"]["pg"][pi.realPage(1)]["d"] == 2) {
		//if (info["d"] == 2) {
		if (pi.direction == 2) {
			_currentPage = parseInt($("#page5_slider").attr("value"));
		}

		$("#page5_slider").slider("refresh");

		$("#page5").popup("close");

		_loadingiconShow(e);

		setTimeout(function() {
			loadImage(_currentPage, fontSize, false, false, e);
			currentPage = _currentPage;
		}, 300);
	});


	$("#navbox_page6").bind("tap", function(e) {
		e.preventDefault();
		e.stopPropagation();

	});

	$("#page6_close").bind("tap", function() {
		showPage6 = false;
		if (true == S2) $("#blank").show();
		$.mobile.changePage("#page1", {
			transition: "none"
		});

		invalidateBody();

		dispBookmark = false;
		unVisibleHeader();
		onRotateFunc = null;
		onRotateRevertFunc = null;
	});


	$("#navbox_page7").bind("tap", function(e) {
		e.preventDefault();
		e.stopPropagation();
		unVisibleNavi();

		$("#headerbox_align").css('text-align', 'center');
		$("#headerbox_title").text("ビューア情報");

		$("#page7").popup("open");
	});

	$("#page7_close").bind("tap", function() {
		$("#page7").popup("close");
	});

	$("#navbox_page8").bind("tap", function(e) {
		e.preventDefault();
		e.stopPropagation();

		if (showPage8Flag) {
			showPage8 = true;
		}

		if ($('div[data-role="header"]').css("display") == "block" && $("#navbox").css("display") == "block") {
			$('div[data-role="header"]').slideUp();
			$("#navbox").slideUp();

			if (deviceType == IOS_DEVICE) {
				if ($("input[name=help]").val() != "") window.open($("input[name=help]").val());
			} else {
				$("#help_form").submit();
			}
		}
	});


	$("#navbox_page9").bind("tap", function(e) {
		e.preventDefault();
		e.stopPropagation();
		unVisibleHeader();
		unVisibleNavi();

		if ($("input[name=url]").val() != "") {
			window.location = $("input[name=url]").val();
		} else {
			//history.back();
			//window.parent.postMessage("viewerfinish", orgDomain);
			urlinfo.returnUrl();
		}
	});

	$("#page_end_button1").bind("tap", function() {

		pagingInPinching = false;
/*
		isPinching = false;
		hideBackFowardButton();
		myScroll.zoom(0, 0, 1, 0);
		myScroll.vScroll = false;
*/
		//debuglog("page_end is closed by #page_end_button1");
		$("#page_end").popup("close");
		_loadingiconShow();
		setTimeout(function() {
			currentPage = 1;
			loadImage(1, fontSize, false, false);
		}, 300);

		if (showMenuFlag) {
			showMenuFlag = false;
			_tap();
		}
		dispBookmark = false;
		//unVisibleHeader();
		onRotateFunc = null;
		onRotateRevertFunc = null;

	});

	$("#page_end_button2").bind("tap", function() {
		// サイトへ戻る
		/*
		if ($("input[name=url]").val() != "") {
			window.location = $("input[name=url]").val();
		} else {
			history.back();
		}
		*/
		//history.back();
		//history.back();
		//window.parent.postMessage("viewerfinish", orgDomain);
		urlinfo.returnUrl();
	});

	$("#page_end_button3").bind("tap", function() {
		//debuglog("page_end is closed by #page_end_button3");
		$("#page_end").popup("close");
		if (showMenuFlag) {
			showMenuFlag = false;
			_tap();
		}
	});

	$("#page_error_button").bind("tap", function() {
		if ($("input[name=url]").val() != "") {
			window.location = $("input[name=url]").val();
		} else {
			//history.back();
			//window.parent.postMessage("viewerfinish", orgDomain);
			urlinfo.returnUrl();
		}
	});

	$("#pageError2_close").bind("tap", function() {
		if (startUp) retryPageError3 = false;
		isErrorRetry = false;
		$("#pageError2").popup("close");
	});

	$("#page_error2_button").bind("tap", function() {
		if (startUp) {
			retryPageError3 = true;
			$("#pageError2").popup("close");
			if (isFirst) {
				firstPage();
			} else {
				continuePage();
			}
		} else {
			isErrorRetry = true;
			$("#pageError2").popup("close");
			_loadingiconShow();
			setTimeout(function() {
				loadImage(dispPage, dispFont, false, true);
			}, 300);
		}
	});

	$("#pageError3_close").bind("tap", function() {
		$("#pageError3").popup("close");
	});

	$("#page_error3_button").bind("tap", function() {
		$("#pageError3").popup("close");
	});

	var isTaphold = false;
	var tapTimeout = 300;
/* tapholdはいらない
	$("#page1_content").bind("taphold", function(e) {
		// 拡大中はメニューを表示しない
		if (isPinching) {
			return;
		}
		e.preventDefault();
		e.stopPropagation();
		if (true == isTaphold) {
			return;
		}
		if (deviceType != IOS_DEVICE) {
			isTaphold = true;
		}
		if ((page3Bookmarks_num == 0) && (page4Bookmarks_del_num == 0) && (displayPopup == null)) {
			$("#headerbox_align").css('text-align', 'left');
			//$("#headerbox_title").text(bookInfo["title"]);
			$("#headerbox_title").text("");
			visibleHeader();
			visibleNavi();
		}
		invalidateBody();
	});
*/
	$("#page1_content").bind("tap", function(e) {
		debuglog("#page1_content tap");
		//e.preventDefault();
		//e.stopPropagation();
/*
		if (deviceType == IOS_DEVICE) {
			_tap();
		} else {
			if (isTaphold) {
				isTaphold = false;
			} else {
				_tap();
			}
		}
*/
	});

	/* pinchin/out cancel
	// ピンチイン・ピンチアウトイベント
	var isGesture = false;
	// for iOS
	$("#page1_content").bind("gesturestart", gesturestartHandler);

	// for Android
	$$('#page1_content').pinching(function(){ isGesture = true; });

	// ブラウザのジェスチャー機能をキャンセル
	$$("#page1_content").on("touchstart",function(event){ event.preventDefault(); });

	$$("#page1_content").on("gesturestart",function(event){ event.preventDefault(); });

	$("#page1_content").bind("touchend", touchendHandler);
	*/

	var swipeOK = true;
	/*
	$("#page1_content").bind("swipeleft", function(e) {
		if (undefined != myScroll) {
			if (1 < myScroll.scale) {
				return;
			}
		}

		if(!swipeOK){
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		var actStatusBusy = false;
		for (var i=0; i<SAKIYOMI; i++) {
			if ((0 != actStatusNext) || (0 != actStatusPrev)) {
				actStatusBusy = true;
				break;
			}
		}

		if (actStatusBusy) {
		for (var i=0; i<SAKIYOMI; i++) {
			if (0 != actStatusNext) {
				actStatusNext = 2;
				if (requestNext != null) {
					requestNext.abort();
				}
			}
			if (0 != actStatusPrev) {
				actStatusPrev = 2;
				if (requestPrev != null) {
					requestPrev.abort();
				}
			}
		}
		}

		if (true == setCacheFlag) {
			return;
		}

		if (true == startUp) {
			return;
		}
		if (true == _isLoadingShow()) {
			return;
		}
		if ( true == isVisibleNavi() ) {
			return;
		}

		_loadingiconShow(e);
		var d = headerInfo["pgs"]["pg"][currentPage-1]["d"];
		if (d == 1) {
			if (1 < currentPage) {
				setTimeout(function() {
					loadImage(currentPage-1, fontSize, false, false, e);
				}, 100);
			} else {
				_loadingiconHide();
			}
		}
		if (d == 2) {
			if (currentPage < parseInt(headerInfo["num"])) {
				setTimeout(function() {
					loadImage(currentPage+1, fontSize, false, false, e);
				}, 100);
			} else if (currentPage == parseInt(headerInfo["num"])) {
				_loadingiconHide();

				$("#page_end").popup("open");
				isUnread = false;
				setUnread();
			} else {
				_loadingiconHide();
			}
		}

	// end swipeleft
	});

	$("#page1_content").bind("swiperight", function(e) {
	if (undefined != myScroll) {
	if (1 < myScroll.scale) {
	return;
	}
	}

	if(!swipeOK){
	return;
	}

	e.preventDefault();
	e.stopPropagation();

	var actStatusBusy = false;
	for (var i=0; i<SAKIYOMI; i++) {
	if ((0 != actStatusNext) || (0 != actStatusPrev)) {
	actStatusBusy = true;
	break;
	}
	}

	if (actStatusBusy) {
	for (var i=0; i<SAKIYOMI; i++) {
	if (0 != actStatusNext) {
	actStatusNext = 2;
	if (requestNext != null) {
	requestNext.abort();
	}
	}
	if (0 != actStatusPrev) {
	actStatusPrev = 2;
	if (requestPrev != null) {
	requestPrev.abort();
	}
	}
	}
	}

	if (true == setCacheFlag) {
	return;
	}

	if (true == startUp) {
	return;
	}
	if (true == _isLoadingShow()) {
	return;
	}
	if ( true == isVisibleNavi() ) {
	return;
	}

	_loadingiconShow(e);
	var d = headerInfo["pgs"]["pg"][currentPage-1]["d"];
	if (d == 1) {
	if (currentPage < parseInt(headerInfo["num"])) {

	setTimeout(function() {
	loadImage(currentPage+1, fontSize, false, false, e);
	}, 100);
	}else if (currentPage == parseInt(headerInfo["num"])) {
	_loadingiconHide();

	$("#page_end").popup("open");
	isUnread = false;
	setUnread();
	}
	else {
	_loadingiconHide();
	}
	}
	if (d == 2) {
	if (1 < currentPage) {

	setTimeout(function() {
	loadImage(currentPage-1, fontSize, false, false, e);
	}, 100);
	}
	else {
	_loadingiconHide();
	}
	}

	// end swiperight
	});
	*/

	$$("#page0").doubleTap(function() {
		event.preventDefault();
		event.stopPropagation();
	});

	$$("#page1").doubleTap(function() {
		debuglog("#page1 doubletap");
		event.preventDefault();
		event.stopPropagation();
	});

	$$("#page1_content").doubleTap(function() {
		debuglog("#page1_content doubletap");
		event.preventDefault();
		event.stopPropagation();
	});
	$$("#viewer-wrapper").doubleTap(function() {
		debuglog("#viewer-wrapper doubletap");
		event.preventDefault();
		event.stopPropagation();
	});
	$$("#page6").doubleTap(function() {
		event.preventDefault();
		event.stopPropagation();
	});

	// document.ready end
});

// old inner function move to global
function bindResizeWindow() {

	// new logic
	$(window).on('resize', function() {

		// add resizeng
		var margin = CANVAS_MARGIN;
		var wh = Size.height();

		// for contents
		$("#page1_content").css("height", (wh + 1) + "px");
		$("#page1").css("height", (wh + margin) + "px");

		// for body
		$("body").css("height", wh + "px");

		// popup re-center
		if (displayPopup != null) {
			popUpCenterPosition(displayPopup);
		}

                redrawWithResize();
                if (currentPage > 1 && currentPage % 2 == 1) {
                        currentPage--;
                }
                var copyimgArgs = {
                        id: currentPage,
                        called: "resize",
                        atimes: 0,
                        next: function() {}
                };
                copyimg(copyimgArgs);

                //redrawWithResize();

		var sk = SizeKeeper.getInstance();
		sk.update();
	});

/* old logic
	$(window).on('resize', function() {

		if (showPage8Flag) {
			if (showPage8) {
				showPage8 = false;
				return;
			}
		}

		if (startUp) {
			return;
		}

		invalidateBody();

		if (showPage6) {
			if (deviceType == IOS_DEVICE) {
				var maxSize = Math.max(screen.width, screen.height);
				$("body").css("height", maxSize);
			}

			tocFitPage();
		}

		if (deviceType != IOS_DEVICE) {
			if (true == needsPageAnimation) {
				$("#page1").hide();
			}
		}

		if (resizeTimer !== null) {
			clearTimeout(resizeTimer);
		} else {
			if (deviceType == IOS_DEVICE) {
				var maxSize = Math.max(screen.width, screen.height);
				$("body").css("height", maxSize);
			}
		}
		resizeTimer = setTimeout(resizeImage, resizeWait);
	});
	//bindResizeWindow end
*/
}

function resizeImage() {

	if (null != displayPopup) {
		rotateKeepPopup = displayPopup;
	}
	fitPage();
	if (deviceType != IOS_DEVICE) {
		if (null != resizeFadeInTimerId) {
			clearTimeout(resizeFadeInTimerId);
		}
		resizeFadeInTimerId = setTimeout(function() {
			invalidateBody();
			if (true == needsPageAnimation) {
				needsPageAnimation = false;
				$("#page1").fadeIn(300);
			}
		}, RESIZE_WAIT_INTERVAL_MS);
	}

	var interval = 301;
	if (deviceType != IOS_DEVICE) {
		interval += RESIZE_WAIT_INTERVAL_MS;
	}
	if (null != resizeKeepPopupOpenTimerId) {
		clearTimeout(resizeKeepPopupOpenTimerId);
	}
	resizeKeepPopupOpenTimerId = setTimeout(function() {
		if (null != rotateKeepPopup) {
			if (true == needsRotateOpenPopUp) {
				needsRotateOpenPopUp = false;
				popUpCenterPosition(rotateKeepPopup);
			}
			rotateKeepPopup = null;
		}
		if (null != onRotateRevertFunc) {
			onRotateRevertFunc();
		}

		invalidateBody();
		resizeTimer = null;
	}, interval);
	// resizeImage end
}

var printf = function(format) {
	for (var i = 1; i < arguments.length; i++) {
		var pattern = new RegExp("\\{" + (i - 1) + "\\}", "g");
		format = format.replace(pattern, h(arguments[i]));
	}
	return format;
}
	// printf end

var h = function(str) {
	if (str !== null) {
		str = str.toString();
		str = str.replace(/&/g, "&amp;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
	} else str = "";
	return str;
	// h end
}

function setUpTouchHandle() {}

function setPopUpDialogCallback() {

	$("#page0").on({
		popupafteropen: function(event, ui) {
			invalidateBody();
			displayPopup = $("#page0" + JQUERY_POPUP_SUFFIX);
		},
		popupafterclose: function(event, ui) {
			displayPopup = null;
		}
	});
	$("#page0_button1").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page0_button2").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#navbox_page2").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#navbox_page3").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#navbox_page4").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#navbox_page5").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#navbox_page6").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#navbox_page7").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#navbox_page8").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#navbox_page9").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page2").on({
		popupafterclose: function(event, ui) {
			if (false == fontSizeRequested) {
				if (fontSize != _fontSize) {
					_fontSize = fontSize;
				}
			}

			unVisibleHeader();
			invalidateBody();
			displayPopup = null;
		},
		popupafteropen: function(event, ui) {
			forceVisibleHeader();
			displayPopup = $("#page2" + JQUERY_POPUP_SUFFIX);
			invalidateBody();
			$("#page2").focus();
		}
	});
	$("#page2_close").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page2_button").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page3").on({
		popupafterclose: function(event, ui) {
			if (page3Bookmarks_num == 0) {
				unVisibleHeader();
			}
			invalidateBody();
			displayPopup = null;
			$("#page3_bookmarks1").blur();
			$("#page3_bookmarks2").blur();
			$("#page3_bookmarks3").blur();

			// ポップアップクローズ後に位置を調整する
			scrollToWithPopupClose();
		},
		popupafteropen: function(event, ui) {
			// ダイアログを表示する時は「ビューア閉じる」を非表示
			//$("#td_page_back").css("display", "none");
			page3Bookmarks_num = 0;
			forceVisibleHeader();
			displayPopup = $("#page3" + JQUERY_POPUP_SUFFIX);
			invalidateBody();
			$("#page3").focus();
		}
	});
	$("#page3_close").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page3_bookmarks1").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page3_bookmarks2").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page3_bookmarks3").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page3_dialog").on({
		popupafterclose: function(event, ui) {
			displayPopup = null;
			if (page3Bookmarks_num == 0) {
				unVisibleHeader();
			}
			if (true == page3_unselectedAction) {
/* ページ番号が更新されないため再表示をしない
				setTimeout(function() {
					$("#page3").popup("open");
				}, 1000);
*/
			}
			page3Bookmarks_num = 0;
			_tap();
		},
		popupafteropen: function(event, ui) {
			forceVisibleHeader();
			displayPopup = $("#page3_dialog" + JQUERY_POPUP_SUFFIX);
			invalidateBody();
			$("#page3_dialog").focus();
		}
	});
	$("#page3_dialog_button1").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page3_dialog_button2").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});

	$("#page4").on({
		popupafterclose: function(event, ui) {
			if (page4Bookmarks_del_num == 0) {
				unVisibleHeader();
			}
			invalidateBody();
			displayPopup = null;
			$("#page4_bookmarks1").blur();
			$("#page4_bookmarks1_del").blur();
			$("#page4_bookmarks2").blur();
			$("#page4_bookmarks2_del").blur();
			$("#page4_bookmarks3").blur();
			$("#page4_bookmarks3_del").blur();

			// ポップアップクローズ後に位置を調整する
			scrollToWithPopupClose();
		},
		popupafteropen: function(event, ui) {
			// ダイアログを表示する時は「ビューア閉じる」を非表示
			//$("#td_page_back").css("display", "none");
			page4Bookmarks_del_num = 0;
			forceVisibleHeader();
			displayPopup = $("#page4" + JQUERY_POPUP_SUFFIX);
			invalidateBody();
			$("#page4").focus();
		}
	});
	$("#page4_close").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page4_bookmarks1").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page4_bookmarks1_del").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page4_bookmarks2").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page4_bookmarks2_del").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page4_bookmarks3").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page4_bookmarks3_del").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page4_dialog").on({
		popupafterclose: function(event, ui) {
			displayPopup = null;
			if (page4Bookmarks_del_num == 0) {
				unVisibleHeader();
			}
			if (true == page4_unselectedAction) {
/* しおり削除後にXボタンが残るので、再表示をしない
				setTimeout(function() {
					$("#page4").popup("open");
				}, 1000);
*/
			}

			//ヘッダー、ナビは非表示にする
			page4Bookmarks_del_num = 0;
			_tap();
		},
		popupafteropen: function(event, ui) {
			forceVisibleHeader();
			displayPopup = $("#page4_dialog" + JQUERY_POPUP_SUFFIX);
			invalidateBody();
			$("#page4_dialog").focus();
		}
	});
	$("#page4_dialog_button1").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page4_dialog_button2").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});

	$("#page5").on({
		popupafterclose: function(event, ui) {
			displayPopup = null;
			unVisibleHeader();
			invalidateBody();
			$("#page5_close").blur();
			$("#page5_top").blur();
			$("#page5_prev").blur();
			$("#page5_next").blur();
			$("#page5_end").blur();
			$("#page5_left_top").blur();
			$("#page5_left_prev").blur();
			$("#page5_left_next").blur();
			$("#page5_left_end").blur();
			$("#page5_button1").blur();
			$("#page5_button2").blur();

			// ポップアップクローズ後に位置を調整する
			scrollToWithPopupClose();
		},
		popupafteropen: function(event, ui) {
			// ダイアログを表示する時は「ビューア閉じる」を非表示
			//$("#td_page_back").css("display", "none");
			forceVisibleHeader();
			displayPopup = $("#page5" + JQUERY_POPUP_SUFFIX);
			invalidateBody();
			$("#page5").focus();
		}
	});
	$("#page5_close").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page5_top").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page5_prev").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page5_next").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page5_end").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page5_left_top").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page5_left_prev").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page5_left_next").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page5_left_end").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page5_button1").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page5_button2").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});

	$("#page6").on({
		pagebeforeshow: function(event, ui) {
			onRotateFunc = function() {};
			onRotateRevertFunc = function() {

				showPage6 = true;
				if (true == S2) $("#blank").hide();
				$.mobile.changePage("#page6", {
					transition: "none"
				});

				if (deviceType == IOS_DEVICE) {
					var maxSize = Math.max(screen.width, screen.height);
					$("body").css("height", maxSize);
				}
				tocFitPage();

			};
			unVisibleHeader();
			invalidateBody();
			enableDefaultTouchEvent = true;
		},
		pagebeforehide: function(event, ui) {
			enableDefaultTouchEvent = false;
		}
	});
	$("#page6_listview").on({
		pagebeforeshow: function(event, ui) {
			$(this).focus();
		}
	});
	$("#page6_close").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page7").on({
		popupafterclose: function(event, ui) {
			displayPopup = null;
			unVisibleHeader();
			invalidateBody();
			$("#page7_close").blur();
		},
		popupafteropen: function(event, ui) {
			forceVisibleHeader();
			displayPopup = $("#page7" + JQUERY_POPUP_SUFFIX);
			invalidateBody();
			$("#page7").focus();
		}
	});
	$("#page7_close").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});

	$("#page_end").on({
		popupafterclose: function(event, ui) {
			debuglog("#page_end popupafterclose");
			displayPopup = null;
			unVisibleHeader();
			invalidateBody();
			$("#page_end_button1").blur();
			$("#page_end_button2").blur();
			$("#page_end_button3").blur();
		},
		popupafteropen: function(event, ui) {
			debuglog("#page_end popupafteropen");
			displayPopup = $("#page_end" + JQUERY_POPUP_SUFFIX);
			invalidateBody();
			//$("#page_end").focus();
		}
	});
	$("#page_end_button1").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page_end_button2").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page_end_button3").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});

	$("#pageWarning").on({
		popupafterclose: function(event, ui) {
			displayPopup = null;
			invalidateBody();
			//$("#page_warning_button1").blur();
			//$("#page_warning_button2").blur();
			isShowWarning = false;
			$("#page_warning_button1").unbind("tap");
			$("#page_warning_button2").unbind("tap");
		},
		popupafteropen: function(event, ui) {
			displayPopup = $("#pageWarning" + JQUERY_POPUP_SUFFIX);
			invalidateBody();
			isShowWarning = true;
			$("#pageWarning").focus();
		}
	});
	$("#page_warning_button1").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page_warning_button2").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});

	$("#pageError").on({
		popupafterclose: function(event, ui) {
			displayPopup = null;
			invalidateBody();
			$("#page_error_button").blur();
		},
		popupafteropen: function(event, ui) {
			displayPopup = $("#pageError" + JQUERY_POPUP_SUFFIX);
			invalidateBody();
			$("#pageError").focus();
		}
	});
	$("#page_error_button").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});

	$("#pageError1").on({
		popupafterclose: function(event, ui) {
			displayPopup = null;
			invalidateBody();
		},
		popupafteropen: function(event, ui) {
			displayPopup = $("#pageError1" + JQUERY_POPUP_SUFFIX);
			invalidateBody();
			$("#pageError1").focus();
		}
	});

	$("#pageError2").on({
		popupafterclose: function(event, ui) {
			displayPopup = null;
			invalidateBody();

			if (startUp) {
				if (!retryPageError3) {
					$("#page0").popup("open");
				} else {
					retryPageError3 = false;
				}
			}

			if (!isErrorRetry) {
				//currentPage = parseInt(current_images[0]["page"]);
				currentPage = parseInt(0);
				dispPage = 0;
				dispFont = 0;
			}
			_loadingiconHide();

			$("#pageError2_close").blur();
			$("#page_error2_button").blur();
		},
		popupafteropen: function(event, ui) {
			retryPageError3 = false;
			isErrorRetry = false;
			displayPopup = $("#pageError2" + JQUERY_POPUP_SUFFIX);
			invalidateBody();
			$("#pageError2").focus();
		}
	});
	$("#pageError2_close").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page_error2_button").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});

	$("#pageError3").on({
		popupafterclose: function(event, ui) {
			displayPopup = null;
			invalidateBody();

			$("#pageError3_close").blur();
			$("#page_error3_button").blur();
		},
		popupafteropen: function(event, ui) {
			displayPopup = $("#pageError3" + JQUERY_POPUP_SUFFIX);
			invalidateBody();
			$("#pageError3").focus();
		}
	});
	$("#pageError3_close").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	$("#page_error3_button").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	// back button at top-left
	$("#navbox_page_back").on({
		vmousedown: function(event, ui) {
			$(this).focus();
		},
		vmouseup: function(event, ui) {
			$(this).blur();
		}
	});
	// setPopUpDialogCallback end
}

function invalidateBody() {
	debuglog("invalidBody called");
	//scrollTo(1, 0);
	// invalidateBody end
}

function createXMLHttpRequest() {
	return new XMLHttpRequest();
	// createXMLHttpRequest end
}

function initPreloadIMGFile() {
	for (var i = 0; i < SAKIYOMI; i++) {
		next_images[i] = {
			"page": 0,
			"status": false,
			"image": null,
			"docode1": "",
			"decode2": null,
			"mime": ""
		};
		prev_images[i] = {
			"page": 0,
			"status": false,
			"image": null,
			"docode1": "",
			"decode2": null,
			"mime": ""
		};
	}
	filesize = 0;
	// initPreloadIMGFile end
}

function loadImage(pagenum, dispFontSize, refresh, clearFlg, e) {

	// set currentPage
	//var isCover = bookInfo["cover"];
	var isCover = pi.cover;
	var page = pagenum;
	if (isLandscape()) {
		if (isCover == 1) {
			if (page > 1) {
				if (page % 2 == 1) {
					page--;
				}
			}
		} else {
			if (page % 2 == 0) {
				page--;
			}
		}
	}

	currentPage = page;

	// to canvas
	displaypage(currentPage);

	// old logic
	if (undefined == e) e = false;
	if (false != e) {
		e.preventDefault();
		e.stopPropagation();
	}

	if (!refresh) {
		dispPage = pagenum;
		dispFont = dispFontSize;
	}
	//var beforepage = parseInt(current_images[0]["page"]);
	var beforepage = parseInt(0);
	var disp_image = {
		"page": 0,
		"status": false,
		"image": null,
		"docode1": "",
		"decode2": null,
		"mime": ""
	};
	/*

		if(parseInt(current_images[0]["page"]) == pagenum){
			disp_image = current_images[0];
		}else{
			for (var i=0; i<SAKIYOMI; i++) {
				if(next_images[i]["page"] == pagenum){
					disp_image = next_images[i];
					break;
				}
				if(prev_images[i]["page"] == pagenum){
					disp_image = prev_images[i];
					break;
				}
			}
		}

		if ((0 == parseInt(disp_image["page"]) || false == disp_image["status"]) || (fontSize != dispFontSize)) {

			debuglog("読込み処理開始 page=" + pagenum + ", time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());

			getImageFile(disp_image, pagenum, true, dispFontSize, e);

			debuglog("読込み処理終了 page=" + pagenum + ", time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());

		}
	*/
	if (true == firstTime) {
		firstTime = false;
	}
	/*
		if (true == setCacheFlag) {
			loadImage(pagenum, dispFontSize, refresh, clearFlg, e);
		}
	*/
	if (undefined != myScroll) {
		myScroll.zoom(0, 0, 1, 0);
	}
	displayImage(disp_image, pagenum, dispFontSize, e);
	/*
		var loadingTime = 10;
		setTimeout(function() {
			_loadingiconHide();

			setCacheFlag = true;

			if(clearFlg){
				initPreloadIMGFile();
			}
			if(!refresh){
				currentPage = pagenum;
				fontSize = dispFontSize;
				setPage();
				setCache(beforepage, pagenum, disp_image, clearFlg);
			}

			setCacheFlag = false;

			var _next = false;

			var nextPage = currentPage + 1;
			for (var i=0; i<next_images.length; i++, nextPage++) {
				if (parseInt(headerInfo["num"]) < nextPage) break;
				if ((false == next_images[i]["status"]) || (next_images[i]["page"] != nextPage)) {
					_next = true;
					getPreImageFile(true, i, nextPage, false, fontSize);
					break;
				}
			}

			if (false == _next) {
				var prevPage = currentPage - 1;
				for (var i=0; i<prev_images.length; i++, prevPage--) {
					if (prevPage <= 0) break;
					if ((false == prev_images[i]["status"]) || (prev_images[i]["page"] != prevPage)) {
						getPreImageFile(false, i, prevPage, false, fontSize);
						break;
					}
				}
			}
		}, loadingTime);
	*/
	// loadImage end
}

/* all comment : setCache
function setCache(before_page, after_page, dispImage, clearFlg) {

if(before_page == 0){
current_images[0] = {"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""};
current_images[0] = dispImage;
return;
}

if(before_page == after_page){
return;
}

var cacheCnt = SAKIYOMI;
var movePageCnt = after_page - before_page;
if(movePageCnt == 1){
if (true == clearFlg) {
prev_images.unshift({"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""});
}
else {
prev_images.unshift(current_images[0]);
}
prev_images.pop();

current_images[0] = {"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""};
current_images[0] = next_images.shift();
if (0 == parseInt(current_images[0]["page"]) || false == current_images[0]["status"]) {
current_images[0] = {"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""};
current_images[0] = dispImage;
}

next_images.push({"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""});

}else if(movePageCnt == -1){
if (true == clearFlg) {
next_images.unshift({"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""});
}
else {
next_images.unshift(current_images[0]);
}
next_images.pop();

current_images[0] = {"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""};
current_images[0] = prev_images.shift();
if (0 == parseInt(current_images[0]["page"]) || false == current_images[0]["status"]) {
current_images[0] = {"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""};
current_images[0] = dispImage;
}

prev_images.push({"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""});

}else{
var after_current_images = new Array();
if (true == clearFlg) {
after_current_images[0] = {"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""};
}
else {
after_current_images[0] = {"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""};
after_current_images[0] = current_images[0];
}

current_images[0] = {"page":0, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""};
current_images[0] = dispImage;
if(Math.abs(movePageCnt) <= cacheCnt){
var after_next_images = new Array();
var after_prev_images = new Array();

for (var i=0; i<cacheCnt; i++) {
var nextidx = after_page+1+i;
if(parseInt(headerInfo["num"]) < nextidx){
nextidx = 0;
}
after_next_images[i] = {"page":nextidx, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""};

var previdx = after_page-1-i;
if(previdx <= 0){
previdx = 0;
}
after_prev_images[i] = {"page":previdx, "status":false, "image":null, "docode1":"", "decode2":null, "mime":""};
}

for (var i=0; i<cacheCnt; i++) {
for (var j=0; j<cacheCnt; j++) {
if (parseInt(after_prev_images[i]["page"]) == parseInt(prev_images[j]["page"])) {
after_prev_images[i] = prev_images[j];
}

if (parseInt(after_prev_images[i]["page"]) == parseInt(after_current_images[0]["page"])) {
after_prev_images[i] = after_current_images[0];
}

if (parseInt(after_prev_images[i]["page"]) == parseInt(next_images[j]["page"])) {
after_prev_images[i] = next_images[j];
}
}
}

for (var i=0; i<cacheCnt; i++) {
for (var j=0; j<cacheCnt; j++) {
if (parseInt(after_next_images[i]["page"]) == parseInt(prev_images[j]["page"])) {
after_next_images[i] = prev_images[j];
}

if (parseInt(after_next_images[i]["page"]) == parseInt(after_current_images[0]["page"])) {
after_next_images[i] = after_current_images[0];
}

if (parseInt(after_next_images[i]["page"]) == parseInt(next_images[j]["page"])){
after_next_images[i] = next_images[j];
}
}
}

for (var i=0; i<cacheCnt; i++) {
next_images[i] = after_next_images[i];
prev_images[i] = after_prev_images[i];
}
}
}
// setCache end
}
*/
function cacheImage(e) {

	if (undefined == e) e = false;
	if (false != e) {
		e.preventDefault();
		e.stopPropagation();
	}

	var actStatusStopping = false;
	for (var i = 0; i < SAKIYOMI; i++) {
		if ((2 == actStatusNext) || (2 == actStatusPrev)) {
			actStatusStopping = true;
			break;
		}
	}

	var nextPage = currentPage;

	n1:
		for (var i = 0; i < next_images.length; i++) {
			nextPage++;
			//if (parseInt(headerInfo["num"]) < nextPage) break;
			if (parseInt(pi.end) < nextPage) break;
			if ((false == next_images[i]["status"]) || (next_images[i]["page"] != nextPage)) {
				if (actStatusStopping) {
					break n1;
				} else {
					getPreImageFile(true, i, nextPage, false, fontSize);
					break n1;
				}
			}
		}

	var prevPage = currentPage;

	p1:
		for (var i = 0; i < prev_images.length; i++) {
			prevPage--;
			if (prevPage <= 0) break;
			if ((false == prev_images[i]["status"]) || (prev_images[i]["page"] != prevPage)) {
				if (actStatusStopping) {
					break p1;
				} else {
					getPreImageFile(false, i, prevPage, false, fontSize);
					break p1;
				}
			}
		}
		// cacheImage end
}

function getImageFile(image, pagenum, dispFlg, dispFont, e) {

	if (undefined == e) e = false;
	if (false != e) {
		e.preventDefault();
		e.stopPropagation();
	}

	image["page"] = pagenum;
	image["status"] = false;
	image["image"] = new Image();
	image["image2"] = new Image();

	// yamaoka
	var pagenum2 = pi.realPage(pagenum);
	var info = getTargetHeaderInfo(pagenum2 - 1);
	//image["image2"].src = urlinfo.params["contents"] + "/img/" + headerInfo["pgs"]["pg"][pagenum2 - 1]["img"];
	image["image2"].src = urlinfo.params["contents"] + "/img/" + info["img"];
	_loadingiconHide();

	return true;

	// old logic as follows
	//var image_content = urlinfo.params["contents"] + "/img/" + headerInfo["pgs"]["pg"][pagenum2 - 1]["img"];
	var image_content = urlinfo.params["contents"] + "/img/" + info["img"];
	var imgLoadXmlHttpObj = null;
	imgLoadXmlHttpObj = createXMLHttpRequest();
	imgLoadXmlHttpObj.open("GET", image_content, false);
	imgLoadXmlHttpObj.overrideMimeType("text/plain; charset=x-user-defined");
	imgLoadXmlHttpObj.onreadystatechange = function() {
		if (imgLoadXmlHttpObj.readyState == 4) {
			if (imgLoadXmlHttpObj.status == 200 || imgLoadXmlHttpObj.status == 0) {

				var res = [];
				res = imgLoadXmlHttpObj.responseText;
				var bytes = [];
				for (i = 0; i < res.length; i++) {
					bytes[i] = res.charCodeAt(i) & 0xff;
				}

				if (bytes.length != 0) {
					filesize = filesize + bytes.length;
					image["image"] = bytes;
				}
			} else {
				_loadingiconHide();

				initImageFile(image, pagenum);

				errorMsgImageFile1(dispFlg);

				return false;
			}
			if (imgLoadXmlHttpObj.responseText == "false") {
				_loadingiconHide();

				initImageFile(image, pagenum);

				errorMsgImageFile2(dispFlg);

				return false;
			}
		}
	}
	imgLoadXmlHttpObj.send(null);

	//getImageFile end
}

function getDecodeFile1(image, pagenum, dispFlg, dispFont, e) {

	if (undefined == e) e = false;
	if (false != e) {
		e.preventDefault();
		e.stopPropagation();
	}

	var _bytes = [];
	var _decode = "../decode.php?content=http://localhost:1104/c0001/data/sample2/" + fontSizes[dispFont] + "/" + headerInfo["pgs"]["pg"][pagenum - 1]["img"];

	_xmlHttpObj = createXMLHttpRequest();
	_xmlHttpObj.open("GET", _decode, false);
	_xmlHttpObj.onreadystatechange = function() {
		if (_xmlHttpObj.readyState == 4) {
			if (_xmlHttpObj.status == 200) {

				var _res = _xmlHttpObj.responseText;

				for (i = 1; i < _res.length; i++) {
					_bytes[i - 1] = _res.charCodeAt(i) & 0xff;
				}
				image["decode1"] = _bytes;
			} else {
				_loadingiconHide();

				initImageFile(image, pagenum);

				errorMsgImageFile1(dispFlg);

				return false;
			}
			if (_xmlHttpObj.responseText == "false") {
				_loadingiconHide();

				initImageFile(image, pagenum);

				errorMsgImageFile2(dispFlg);

				return false;
			}
		}
	}
	_xmlHttpObj.send(null);
	// getDecodeFile1 end
}

function getDecodeFile2(image, pagenum, dispFlg, dispFont, e) {

	if (undefined == e) e = false;
	if (false != e) {
		e.preventDefault();
		e.stopPropagation();
	}

	var _decode2 = "../decode2.php?content=http://localhost:1104/c0001/data/sample2/" + fontSizes[dispFont] + "/" + headerInfo["pgs"]["pg"][pagenum - 1]["img"];

	_xmlHttpObj2 = createXMLHttpRequest();
	_xmlHttpObj2.open("GET", _decode2, false);
	_xmlHttpObj2.onreadystatechange = function() {
		if (_xmlHttpObj2.readyState == 4) {
			if (_xmlHttpObj2.status == 200) {
				image["status"] = true;

				image["decode2"] = eval("(" + _xmlHttpObj2.responseText + ")");
			} else {
				_loadingiconHide();

				initImageFile(image, pagenum);

				errorMsgImageFile1(dispFlg);

				return false;
			}
			if (_xmlHttpObj2.responseText == "false") {
				_loadingiconHide();

				initImageFile(image, pagenum);

				errorMsgImageFile2(dispFlg);

				return false;
			}
		}
	}
	_xmlHttpObj2.send(null);
	// getDecodeFile2 end
}

function initImageFile(image, pagenum) {
	image["page"] = pagenum;
	image["status"] = false;
	image["image"] = new Image();
	image["docode1"] = "";
	image["decode2"] = null;
	image["mime"] = "";
	// initImageFile end
}

function errorMsgImageFile1(dispFlg) {
	if (dispFlg) {
		if (true == firstTime) {
			firstTime = false;
			$("#pageError_message").text("【110】通信に失敗しました。");
			$("#pageError").popup("open");
		} else {
			$("#pageError2_message").text("【91-1】通信に失敗しました。");
			$("#pageError2").popup("open");
		}
	}
	// errorMsgImageFile1 end
}

function errorMsgImageFile2(dispFlg) {
	if (dispFlg) {
		$("#pageError_message").html("【92】コンテンツの取得に<br />失敗しました。");
		$("#pageError").popup("open");
	}
	// errorMsgImageFile2 end
}

function getPreImageFile(isNext, pos, pagenum, dispFlg, dispFont) {

	// no use
	return;

	//debuglog("先読み取得開始 page=" + pagenum + ", time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());

	if (10240 < filesize / 1024) {
		filesize = 0;
		return;
	}

	if (isNext) {
		requestNext = null;
		if (0 == actStatusNext) {
			actStatusNext = 1;
		}
	} else {
		requestPrev = null;
		if (0 == actStatusPrev) {
			actStatusPrev = 1;
		}
	}

	if (((isNext) && (0 != actStatusNext)) || ((!isNext) && (0 != actStatusPrev))) {
		initPreImageFile(isNext, pos, pagenum);

		var option1 = {
				type: "GET",
				url: urlinfo.params["contents"] + "/img/" + headerInfo["pgs"]["pg"][pagenum - 1]["img"],
				dataType: "text",
				success: function(_data) {

					if (((isNext) && (1 == actStatusNext)) || ((!isNext) && (1 == actStatusPrev))) {
						var res = _data;

						var bytes = [];
						for (i = 0; i < res.length; i++) {
							bytes[i] = res.charCodeAt(i) & 0xff;
						}

						if (true == isNext) {
							next_images[pos]["image"] = bytes;
						} else {
							prev_images[pos]["image"] = bytes;
						}

						filesize = filesize + bytes.length;
					}
				},
				error: function() {
					//debuglog("先読みキャンセル page=" + pagenum);

					if (isNext) {
						if (null != requestNext) requestNext = null;
					} else {
						if (null != requestPrev) requestPrev = null;
					}

					if (isNext) {
						actStatusNext = 2;
					} else {
						actStatusPrev = 2;
					}

					initPreImageFile(isNext, pos, 0);
				},
				complete: function() {
					if (((isNext) && (2 == actStatusNext)) || ((!isNext) && (2 == actStatusPrev))) {

						if (isNext) {
							if (null != requestNext) requestNext = null;
						} else {
							if (null != requestPrev) requestPrev = null;
						}

						if (isNext) {
							actStatusNext = 0;
						} else {
							actStatusPrev = 0;
						}

						initPreImageFile(isNext, pos, 0);

						return;
					}

					// 暫定的にdecode.phpコールをコメント
					if (isNext) {
						if (null != requestNext) {} //requestNext = $.ajax(option2);
					} else {
						if (null != requestPrev) {} //requestPrev = $.ajax(option2);
					}
				}
			}
			// option1

		var option2 = {
				type: "GET",
				url: "../decode.php?content=http://localhost:1104/c0001/data/sample2/" + fontSizes[dispFont] + "/" + headerInfo["pgs"]["pg"][pagenum - 1]["img"],
				dataType: "text",
				success: function(_data) {

					if (((isNext) && (1 == actStatusNext)) || ((!isNext) && (1 == actStatusPrev))) {
						var res = _data;

						var bytes = [];
						for (i = 1; i < res.length; i++) {
							bytes[i - 1] = res.charCodeAt(i) & 0xff;
						}

						if (true == isNext) {
							next_images[pos]["decode1"] = bytes;
						} else {
							prev_images[pos]["decode1"] = bytes;
						}
					}
				},
				error: function() {
					//debuglog("先読みキャンセル page=" + pagenum);

					if (isNext) {
						if (null != requestNext) requestNext = null;
					} else {
						if (null != requestPrev) requestPrev = null;
					}

					if (isNext) {
						actStatusNext = 2;
					} else {
						actStatusPrev = 2;
					}

					initPreImageFile(isNext, pos, 0);
				},
				complete: function() {
					if (((isNext) && (2 == actStatusNext)) || ((!isNext) && (2 == actStatusPrev))) {

						if (isNext) {
							requestNext = null;
						} else {
							requestPrev = null;
						}

						if (isNext) {
							actStatusNext = 0;
						} else {
							actStatusPrev = 0;
						}

						initPreImageFile(isNext, pos, 0);

						return;
					}

					// 暫定的にdecode2.phpコールをコメント
					if (isNext) {
						if (null != requestNext) {} //requestNext = $.ajax(option3);
					} else {
						if (null != requestPrev) {} //requestPrev = $.ajax(option3);
					}
				}
			}
			// option2

		var option3 = {
				type: "GET",
				url: "../decode2.php?content=http://localhost:1104/c0001/data/sample2/" + fontSizes[dispFont] + "/" + headerInfo["pgs"]["pg"][pagenum - 1]["img"],
				dataType: "json",
				success: function(_data) {

					if (_data != false) {
						if (true == isNext) {
							if (0 != next_images[pos]["page"]) {
								next_images[pos]["status"] = true;
								next_images[pos]["decode2"] = _data;
							}
						} else {
							if (0 != prev_images[pos]["page"]) {
								prev_images[pos]["status"] = true;
								prev_images[pos]["decode2"] = _data;
							}
						}
					}
				},
				error: function() {
					//debuglog("先読みキャンセル page=" + pagenum);

					if (isNext) {
						if (null != requestNext) requestNext = null;
					} else {
						if (null != requestPrev) requestPrev = null;
					}

					if (isNext) {
						actStatusNext = 2;
					} else {
						actStatusPrev = 2;
					}

					initPreImageFile(isNext, pos, 0);
				},
				complete: function() {
					//debuglog("先読み終了 page=" + pagenum + ", time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());

					if (isNext) {
						requestNext = null;
					} else {
						requestPrev = null;
					}

					if (isNext) {
						actStatusNext = 0;
						pos++;
						if (pos < next_images.length) {
							pagenum++;
							//if (parseInt(headerInfo["num"]) < pagenum) return;
							if (parseInt(pi.end) < pagenum) return;
							if ((false == next_images[pos]["status"]) || (next_images[pos]["page"] != pagenum)) {
								getPreImageFile(true, pos, pagenum, false, fontSize);
							}
						} else {
							var prevPage = currentPage - 1;
							for (var i = 0; i < prev_images.length; i++, prevPage--) {
								if (prevPage <= 0) break;
								if ((false == prev_images[i]["status"]) || (prev_images[i]["page"] != prevPage)) {
									getPreImageFile(false, i, prevPage, false, fontSize);
									break;
								}
							}
						}
					} else {
						actStatusPrev = 0;
						pos++;
						if (pos < prev_images.length) {
							pagenum--;
							if (pagenum <= 0) return;
							if ((false == prev_images[pos]["status"]) || (prev_images[pos]["page"] != pagenum)) {
								getPreImageFile(false, pos, pagenum, false, fontSize);
							}
						}
					}
				}
			}
			// option3

		if (isNext) {
			requestNext = $.ajax(option1);
		} else {
			requestPrev = $.ajax(option1);
		}
	}

	if (((isNext) && (2 == actStatusNext)) || ((!isNext) && (2 == actStatusPrev))) {
		if (isNext) {
			if (null != requestNext) requestNext = null;
		} else {
			if (null != requestPrev) requestPrev = null;
		}

		if (isNext) {
			actStatusNext = 0;
		} else {
			actStatusPrev = 0;
		}

		initPreImageFile(isNext, pos, 0);

		return;
	}
	// getPreImageFile end
}

function initPreImageFile(isNext, pos, pagenum) {
	if (true == isNext) {
		next_images[pos]["page"] = pagenum;
		next_images[pos]["status"] = false;
		next_images[pos]["image"] = new Image();
		next_images[pos]["image2"] = new Image();
		next_images[pos]["docode1"] = "";
		next_images[pos]["decode2"] = null;
		next_images[pos]["mime"] = "";
	} else {
		prev_images[pos]["page"] = pagenum;
		prev_images[pos]["status"] = false;
		prev_images[pos]["image"] = new Image();
		prev_images[pos]["image2"] = new Image();
		prev_images[pos]["docode1"] = "";
		prev_images[pos]["decode2"] = null;
		prev_images[pos]["mime"] = "";
	}
	// initPreImageFile end
}

function errorMsgPreImageFile(dispFlg) {
	if (dispFlg) {
		$("#pageError2_message").text("【91-2】通信に失敗しました。");
		$("#pageError2").popup("open");
	}
	// errorMsgPreImageFile end
}

function decodeImage(image, pagenum, e) {

	if (undefined == e) e = false;
	if (false != e) {
		e.preventDefault();
		e.stopPropagation();
	}

	var img = image["image"];

	var bytes = [];
	for (i = 0; i < img.length; i++) {
		bytes[i] = img[i] & 0xff;
	}

	var _bytes = image["decode1"];
	var new_bytes = [];

	var pagenum2 = pi.realPage(pagenum);
	var fileName = headerInfo["pgs"]["pg"][pagenum2 - 1]["img"];
	var fileNames = fileName.split(".");
	var ext = fileNames[fileNames.length - 1];

	switch (ext) {
		case "jpg":
		case "jpeg":
		case "JPG":
		case "JPEG":
			image["mime"] = "image/jpeg";

			var i = 0;
			for (i; i < bytes.length; i++) {
				if (bytes[i] == 255) {
					if (bytes[i + 1] == 196) break;
				}
			}

			new_bytes = bytes.slice(0, i + 2);
			new_bytes = new_bytes.concat(_bytes);
			new_bytes = new_bytes.concat(bytes.slice(i + 2, bytes.length));
			break;
		case "png":
		case "PNG":
			image["mime"] = "image/png";

			new_bytes = bytes.slice(0, 8);
			new_bytes = new_bytes.concat(_bytes);
			new_bytes = new_bytes.concat(bytes.slice(8, bytes.length));
			break;
	}

	var new_bytes2 = [];

	var binary = "";
	var base64 = "";

	var _res2 = image["decode2"];

	new_bytes2 = new_bytes.slice(0, parseInt(_res2.p));

	for (i = 0; i < 5; i++) {
		for (j = 0; j < _res2.r.length; j++) {
			if (i == parseInt(_res2.r[j])) {
				new_bytes2 = new_bytes2.concat(new_bytes.slice((parseInt(_res2.p) + (parseInt(_res2.l) * j)), (parseInt(_res2.p) + (parseInt(_res2.l) * j) + parseInt(_res2.l))));

			}
		}
	}
	new_bytes2 = new_bytes2.concat(new_bytes.slice((parseInt(_res2.p) + (parseInt(_res2.l) * 5)), new_bytes.length));

	var maxSize = 65536;
	if (new_bytes2.length < maxSize) {
		binary = String.fromCharCode.apply(String, new_bytes2);
	} else {
		var newArr = [];
		for (var i = 0; i < Math.ceil(new_bytes2.length / maxSize); i++) {
			var j = i * maxSize;
			var newBuf = String.fromCharCode.apply(String, new_bytes2.slice(j, j + maxSize));
			newArr[i] = newBuf;
		}
		binary = newArr.join("");
	}

	base64 = btoa(binary);
	var mime = image["mime"];
	image["image"].src = "data:" + mime + ";base64," + base64;
	// decodeImage end
}

function old_currentImage_onload(pagenum) {
	// no use
	//return;
	//debuglog("currentImage.onload start");
	fitPage();
	// image onload end
}

function displayImage(image, pagenum, dispFontSize, e) {

	//debuglog("描画開始 page=" + pagenum + ", time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());

	if (undefined == e) e = false;
	if (false != e) {
		e.preventDefault();
		e.stopPropagation();
	}

	var fr = document.getElementById("iframe_" + pagenum);
	currentImage = fr.contentWindow.document.getElementById("img_" + pagenum);

	old_currentImage_onload(pagenum);

	/*
	currentImage = document.getElementById("viewer");
	currentImage.src = image["image2"].src;

	currentImage.onload = function() {
		debuglog("currentImage.onload start");
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;

		if (startUp) {
			if (headerInfo["pgs"]["pg"][0]["d"] == 1) {
				$("#page1_left").css("top", (windowHeight / 2 - 20) + "px");
				$("#page1_left").css("left", ((windowWidth / 2) - (viewer.width / 2)) + "px");
				$("#page1_left").fadeIn().queue(function() {
					setTimeout(function() {
					$("#page1_left").dequeue();
					}, 3000);
					startUp = false;
				});
				$("#page1_left").fadeOut();
			} else if (headerInfo["pgs"]["pg"][0]["d"] == 2) {
				$("#page1_right").css("top", (windowHeight / 2 - 20) + "px");
				$("#page1_right").css("right", ((windowWidth / 2) - (viewer.width / 2)) + "px");
				$("#page1_right").fadeIn().queue(function() {
					setTimeout(function() {
					$("#page1_right").dequeue();
					}, 3000);
					startUp = false;
				});
				$("#page1_right").fadeOut();
			}
		} else {
			$("#page1_left").hide();
			$("#page1_right").hide();
		}
		$("#debug").text("page=" + pagenum);

		debuglog("描画終了 page=" + pagenum + ", time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());
		debuglog("currentImage.onload end");

		fitPage();
	// image onload end
	}
	*/
	// displayImage end
}

function getTrueSize(image) {
	var w = image.width,
		h = image.height;

	if (typeof image.naturalWidth !== 'undefined') { // for Firefox, Safari, Chrome
		w = image.naturalWidth;
		h = image.naturalHeight;
	} else if (typeof image.runtimeStyle !== 'undefined') { // for IE
		var run = image.runtimeStyle;
		var mem = {
			w: run.width,
			h: run.height
		}; // keep runtimeStyle
		run.width = "auto";
		run.height = "auto";
		w = image.width;
		h = image.height;
		run.width = mem.w;
		run.height = mem.h;

	} else { // for Opera
		var mem = {
			w: image.width,
			h: image.height
		}; // keep original style
		image.removeAttribute("width");
		image.removeAttribute("height");
		w = image.width;
		h = image.height;
		image.width = mem.w;
		image.height = mem.h;
	}

	return {
		width: w,
		height: h
	};
	// getTrueSize end
}

function fitPage() {

	var contentsWidth = Size.width();
	var contentsHeight = Size.height() + 1;

	tocScroll.refresh();

	$("#page1_content").css("height", contentsHeight + "px");

	if (undefined != myScroll) {
		myScroll.zoom(0, 0, 1, 0);
	}
	invalidateBody();
	// fitPage end
}

function fitPage_old() {

	//debuglog("fitPage start");
	if (null == currentImage) {
		return;
	}

	// old func
	//var viewer = document.getElementById("viewer");
	var viewer = document.getElementById("c1");
	debuglog("viewer = " + viewer);

	imageWidth = currentImage.width;
	imageHeight = currentImage.height;

	var truesize = getTrueSize(currentImage);
	if (truesize.width != 0 && truesize.height != 0) {
		imageWidth = truesize.width;
		imageHeight = truesize.height;
	} else {
		//debuglog("truesize error");
	}

	var contentsWidth = window.innerWidth;
	var contentsHeight = Size.height();

	var viewerWidth = 0;
	var viewerHeight = 0;
	switch (deviceType) {
		case ANDROID_DEVICE:
			var ratio = window.devicePixelRatio;
			if (undefined == ratio || 0 == ratio) {
				ratio = 1;
			}
			var outerHeight;
			if (contentsWidth > contentsHeight) {
				outerHeight = Math.min(window.outerWidth, window.outerHeight);
			} else {
				outerHeight = Math.max(window.outerWidth, window.outerHeight);
			}
			if (DEFAULT_BROWSER == browserType) {
				var zoom = window.outerWidth / window.innerWidth;
				contentsHeight = outerHeight / zoom;
			}

			break;
		case IOS_DEVICE:
			var page1_content = document.getElementById("page1_content");
			page1_content.style.width = contentsWidth + "px";
			page1_content.style.height = contentsHeight + "px";
			break;
		default:
			break;
	}
	var ratioWidth = imageWidth / contentsWidth;
	var ratioHeight = imageHeight / contentsHeight;

	if (ratioWidth > ratioHeight) {
		viewerWidth = imageWidth / ratioWidth;
		viewerHeight = imageHeight / ratioWidth;
	} else {
		viewerWidth = imageWidth / ratioHeight;
		viewerHeight = imageHeight / ratioHeight;
	}

	/*
	viewer.width = viewerWidth;
	viewer.height = viewerHeight;
	*/
/*
	$("#page6").css("height", contentsHeight + "px");
	$("#page6_wrapper").css("height", (contentsHeight - 58) + "px");
*/
	tocScroll.refresh();

	var heightOffset = (contentsHeight - viewer.height) / 2;
	var widthOffset = (contentsWidth - viewer.width) / 2;
	/*
	viewer.style.position = 'absolute';
	viewer.style.top = heightOffset + "px";
	viewer.style.left = widthOffset + "px";
	*/
	if (true == S2) {
		var blank = document.getElementById("blank");
		blank.src = "image/blank.png";
		blank.width = viewerWidth;
		blank.height = viewerHeight;

		blank.style.position = 'absolute';
		blank.style.top = heightOffset + "px";
		blank.style.left = widthOffset + "px";

		$("#blank").show();

		if (true == showPage6) {
			$("#blank").hide();
		}
	}
	if (deviceType != IOS_DEVICE) {
		$("#page1_content").css("height", contentsHeight + "px");
		//alert("#page1_content:height = " + $("#page1_content").css("height"));
	}
	if (undefined != myScroll) {
		myScroll.zoom(0, 0, 1, 0);
	}
	invalidateBody();
	//debuglog("fitPage end");
	// fitPage end
}

function popUpCenterPosition(popup) {

	if (null == popup) {
		return;
	}

	// for ios
	setPage1Height();

	var contentsWidth = Size.width();
	var contentsHeight = Size.height();
	var xOffset = (contentsWidth / 2 - popup.width() / 2);
	var yOffset = (contentsHeight / 2 - popup.height() / 2);
	popup.css("left", (contentsWidth / 2 - popup.width() / 2));
	popup.css("top", (contentsHeight / 2 - popup.height() / 2));
	// popUpCenterPosition end
}

function tocFitPage() {

	var page6WrapperWidth = document.getElementById("page6").offsetWidth;
	var page6WrapperHeight = document.getElementById("page6").offsetHeight;

	var contentsWidth = window.innerWidth;
	var contentsHeight = window.innerHeight;

	var wrapperWidth = 0;
	var wrapperHeight = 0;
	switch (deviceType) {
		case ANDROID_DEVICE:
			var ratio = window.devicePixelRatio;
			if (undefined == ratio || 0 == ratio) {
				ratio = 1;
			}
			var outerHeight;
			if (contentsWidth > contentsHeight) {
				outerHeight = Math.min(window.outerWidth, window.outerHeight);
			} else {
				outerHeight = Math.max(window.outerWidth, window.outerHeight);
			}
			if (DEFAULT_BROWSER == browserType) {
				contentsHeight = outerHeight / ratio;
			}
			break;
	}
	var ratioWidth = page6WrapperWidth / contentsWidth;
	var ratioHeight = page6WrapperHeight / contentsHeight;

	if (ratioWidth > ratioHeight) {
		wrapperWidth = page6WrapperWidth / ratioWidth;
		wrapperHeight = page6WrapperHeight / ratioWidth;
	} else {
		wrapperWidth = page6WrapperWidth / ratioHeight;
		wrapperHeight = page6WrapperHeight / ratioHeight;
	}
	$("#page6").css("width", wrapperWidth + "px");
	$("#page6").css("height", wrapperHeight + "px");
	$("#page6_wrapper").css("height", (contentsHeight - 58) + "px");

	tocScroll.refresh();

	invalidateBody();
	// tocFitPage end
}

var bookmarks = function() {
	//var bookmarks = localStorage.getItem(CONTENTS_ROOT_PATH + "/bookmarks/");
	var bookmarks = localStorage.getItem(pi.bookmarkpath);
	if (bookmarks === null) {
		bookmarks = [];
		bookmarks[0] = null;
		bookmarks[1] = null;
		bookmarks[2] = null;
		bookmarks[3] = null;
	} else bookmarks = JSON.parse(bookmarks);
	return bookmarks;
	// bookmarks end
}

function setBookmarks(key) {

	var _bookmarks = bookmarks();

	var _date = new Date();
	var data = _date.getFullYear() + "/" + (parseInt(_date.getMonth()) + 1) + "/" + _date.getDate();

	_bookmarks[key] = {
		page: currentPage,
		size: fontSize,
		date: data
	};
	_bookmarks = JSON.stringify(_bookmarks);
	//localStorage.setItem(CONTENTS_ROOT_PATH + "/bookmarks/", _bookmarks);
	localStorage.setItem(pi.bookmarkpath, _bookmarks);
	// setBookmarks end
}

var unread = function() {

	//var unread = localStorage.getItem(CONTENTS_ROOT_PATH + "/unread/");
	var unread = localStorage.getItem(pi.unreadpath);
	if (unread === null) {
		unread = null;
	} else unread = JSON.parse(unread);
	return unread;
	// unread end
}

function setUnread() {

	var _flag = true;

	var _page = currentPage;

	var _size = fontSize;

	var _unread = unread();
	if (_unread !== null) {
		_flag = _unread["flag"];

		_page = parseInt(_unread["page"]);
		_size = parseInt(_unread["size"]);
	}

	if (!isUnread) _flag = false;

	if (_page <= currentPage) _page = currentPage;
	if (_size != fontSize) {
		_page = currentPage;
		_size = fontSize;
	}
	if (_page <= 0) _page = 1;

	//if (!_flag) _page = parseInt(headerInfo["num"]);
	if (!_flag) _page = parseInt(pi.end);

	_unread = {
		flag: _flag,
		page: _page,
		size: _size
	};
	_unread = JSON.stringify(_unread);
	//localStorage.setItem(CONTENTS_ROOT_PATH + "/unread/", _unread);
	localStorage.setItem(pi.unreadpath, _unread);
	// setUnread end
}

function _loadingicon() {

	if (android2) {
		$("#loadingicon").css("top", (window.innerHeight / 2 - 20) + "px");
		$("#loadingicon").css("left", (window.innerWidth / 2 - 20) + "px");
	} else {
		$("#loadingicon").css("top", (window.innerHeight / 2) + "px");
		$("#loadingicon").css("left", (window.innerWidth / 2) + "px");
	}
	// _loadingicon end
}

function _loadingiconShow(e) {

	loadingiconShow = true;

	if (undefined == e) e = false;
	if (false != e) {
		e.preventDefault();
		e.stopPropagation();
	}

	_loadingicon();

	if (android2) {
		$("#loadingicon").show();
	} else {
		$("#loadingicon").activity(true);
	}
	// _loadingiconShow end
}

function _loadingiconHide() {

	loadingiconShow = false;

	if (android2) {
		$("#loadingicon").hide();
	} else {
		$("#loadingicon").activity(false);
	}
	// _loadingiconHide end
}

function _isLoadingShow() {

	return loadingiconShow;
	// _isLoadingShow end
}

function firstPage(e) {

	$("#page0").popup("close");

	_loadingiconShow(e);

	// 描画スタートをマーク
	// 描画中のページ捲りを抑止するため
	var drawStart = new DrawInProgress();
	drawStart.doInProgress();

	var _bookmarks = bookmarks();
	if (0 in _bookmarks) {
		loadImage(1, fontSize, false, false, e);
		if (_bookmarks[0] !== null && false) {

			//debuglog("はじめから読む処理開始 time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());

			setTimeout(function() {
				fontSize = parseInt(_bookmarks[0]["size"]);
				_fontSize = fontSize;

				//debuglog("はじめから読む処理、通信開始 time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());

				var _headerInfo = urlinfo.params["contents"] + "/img/header.xml";

				if (null == xmlHttpObj) {
					xmlHttpObj = createXMLHttpRequest();
				}
				xmlHttpObj.open("GET", _headerInfo, false);
				xmlHttpObj.onreadystatechange = function() {
					if (xmlHttpObj.readyState == 4) {
						if (xmlHttpObj.status == 200) {
							_isTimeout = false;

							setTimeout(function() {

								headerInfo = eval("(" + xmlHttpObj.responseText + ")");
								loadImage(1, fontSize, false, false, e);
							}, 300);

							//debuglog("はじめから読む処理、通信終了 time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());

						} else {
							_isTimeout = true;

							setTimeout(function() {

								$("#headerbox_align").css('text-align', 'left');
								//$("#headerbox_title").text(bookInfo["title"]);
								$("#headerbox_title").text("");

								$("#pageError2_message").text("【91-3】通信に失敗しました。");
								$("#pageError2").popup("open");
							}, 300);

							return true;
						}
					}
				}
				xmlHttpObj.send(null);

				//debuglog("はじめから読む処理終了 time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());

			}, 300);
		}
	}
	// firstPage end
}

// つづきを読む
function continuePage(e) {

	$("#page0").popup("close");

	_loadingiconShow(e);

	// 描画スタートをマーク
	// 描画中のページ捲りを抑止するため
	var drawStart = new DrawInProgress();
	drawStart.doInProgress();

	var _bookmarks = bookmarks();
	if (0 in _bookmarks) {
		if (_bookmarks[0] !== null) {

			//debuglog("つづきから読む処理開始 time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());

			// 画像読み込みで終了
			loadImage(parseInt(_bookmarks[0]["page"]), parseInt(_bookmarks[0]["size"]), false, false, e);
			return;

			setTimeout(function() {
				currentPage = parseInt(_bookmarks[0]["page"]);

				fontSize = parseInt(_bookmarks[0]["size"]);
				_fontSize = fontSize;

				//debuglog("つづきから読む処理、通信開始 time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());

				var _headerInfo = urlinfo.params["contents"] + "/img/header.xml";

				if (null == xmlHttpObj) {
					xmlHttpObj = createXMLHttpRequest();
				}
				xmlHttpObj.open("GET", _headerInfo, false);
				xmlHttpObj.onreadystatechange = function() {
					if (xmlHttpObj.readyState == 4) {
						if (xmlHttpObj.status == 200 || xmlHttpObj.status == 0) {
							_isTimeout = false;

							setTimeout(function() {

								headerInfo = eval("(" + xmlHttpObj.responseText + ")");

								loadImage(parseInt(_bookmarks[0]["page"]), parseInt(_bookmarks[0]["size"]), false, false, e);
							}, 300);

							//debuglog("つづきから読む処理、通信終了 time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());

						} else {
							_isTimeout = true;

							setTimeout(function() {

								$("#headerbox_align").css('text-align', 'left');
								//$("#headerbox_title").text(bookInfo["title"]);
								$("#headerbox_title").text("");

								$("#pageError2_message").text("【91-4】通信に失敗しました。");
								$("#pageError2").popup("open");
							}, 300);

							return true;
						}
					}
				}
				xmlHttpObj.send(null);

				//debuglog("つづきから読む処理終了 time=" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " " + new Date().getMilliseconds());

			}, 300);
		}
	}
	// continuePage end
}

function page5_slider_event() {
	_currentPage = parseInt($("#page5_slider").attr("value"));

	var info = getTargetHeaderInfo(pi.realPage(1));
	//if (headerInfo["pgs"]["pg"][0]["d"] == 1) {
	//if (headerInfo["pgs"]["pg"][pi.realPage(1)]["d"] == 1) {
	//if (info["d"] == 1) {
	if (pi.direction == 1) {
		//_currentPage = parseInt(headerInfo["num"]) - (_currentPage - 1);
		_currentPage = parseInt(pi.end) - (_currentPage - 1);
	}

	//var page5_num = _currentPage + "/" + parseInt(headerInfo["num"]);
	var page5_num = _currentPage + "/" + parseInt(pi.end);
	$("#page5_num").text(page5_num);

	invalidateBody();
	// page5_slider_event end
}

function _tap() {
	unVisibleHeader();
	unVisibleNavi();
	// _tap end
}

function visibleHeader() {
	if ($("#headerbox").css("display") == "none") {
/*
		$("#td_page_back").css({
			"display": "table",
			"height": "10px"
		});
*/
		$("#headerbox").slideDown();
	}
	// visibleHeader end
}

function forceVisibleHeader() {
	$("#headerbox").slideDown();
	// forceVisibleHeader end
}

function unVisibleHeader() {
	if ($("#headerbox").css("display") == "block") {
		$("#headerbox").slideUp();
	}
	// unVisibleHeader end
}

function initializeMenuSlider() {
	var max = parseInt(pi.end);
	$("#menu_slider").slider({
		step: 1,
		min: 1,
		max: max,
		value: 1,
		slide: function(event, ui) {
			console.log("event : slide");
		},
		create: function(event, ui) {
			console.log("event : create");
		},
		start: function(event, ui) {
			console.log("event : start");
		},
		stop: function(event, ui) {
			console.log("event : stop");
		},
		change: function(event, ui) {
			console.log("event : change");
		}
	});
}

function createMenuSlider() {

	var max = parseInt(pi.end);
	var value = currentPage;

	debuglog("createMenuSlider: max = " + max);
	debuglog("createMenuSlider: value = " + value);

	//$("#menu_slider").slider({"value": value});
	//menuSliderOnCreate();
}

function menuSliderOnChage() {
	var value = $("#menu_slider").attr("value");
	$("#menu_pagenum").text(value + "/" + pi.end);
	displaypage(value);
}

function menuSliderOnCreate() {
	var value = $("#menu_slider").slider("value");
	$("#menu_pagenum").text(value + "/" + pi.end);
}

function visibleNavi() {
	if ($("#navbox").css("display") == "none") {
		if ((page3Bookmarks_num == 0) && (page4Bookmarks_del_num == 0) && (displayPopup == null)) {

			// menu slider[new]
			createMenuSlider();

			$("#navbox").slideDown();
		}
	}
	// visibleNavi end
}

function unVisibleNavi() {
	if ($("#navbox").css("display") == "block") {
		$("#navbox").slideUp();
	}
	// unVisibleNavi end
}

function isVisibleHeader() {
	if ($("#headerbox").css("display") == "block") {
		return true;
	} else {
		return false;
	}
	// isVisibleHeader end
}

function isVisibleNavi() {
	if ($("#navbox").css("display") == "block") {
		return true;
	} else {
		return false;
	}
	// isVisibleNavi end
}

function gesturestartHandler(event) {
	isGesture = true;
	// gesturestartHandler end
}

function touchendHandler(event) {
	// gestureがあれば
	if (isGesture) {
		swipeOK = false;
	} else {
		swipeOK = true;
	}
	isGesture = false;
	// touchendHandler end
}

function setPage() {
	setBookmarks(0);
	setUnread();
	// setPage end
}

function debuglog(str) {
	if (DEBUG) {
		//waterbug.log(str);
		console.log(str);
	}
	// debuglog end
}

// ----- new viewer logic start ----- //

var isCreateBoxDiv = false;

function toPixel(n) {
	return parseInt(n) + "px";
}

function isLandscape() {
	var wh = Size.height();
	var ret = (Size.width() > wh);
	return ret;
}

function setsize() {
	if (isLandscape()) {
		setsize_landscape();
	} else {
		setsize_portrait();
	}
}

function setsizeWithImage(img1, isUnit) {
	if (isLandscape()) {
		if (isSideFit(img1, -1, isUnit)) {
			setsize_landscape_sidefit(isUnit);
		} else {
			setsize_landscape();
		}
	} else {
		setsize_portrait();
	}
}

function setsize_portrait() {
	var topspace = $('#topspace');
	var centerspace = $('#centerspace');
	var bottomspace = $('#bottomspace');

	var wh = Size.height();

	var cw = 0;
	var c1 = document.getElementById('c1');
	var c1q = $('#c1');
	//var ch = c1.height;
	var ch = parseInt(c1q.css('height'));
	//var spaceh = $(window).height() - ch;
	var spaceh = wh - ch;
	var spaceh_unit = spaceh / 2;
	var bottomspace_y = spaceh_unit + ch;

	topspace.css({
		'border': '0px solid blue',
		'position': 'absolute',
		'top': '0px',
		'left': '0px',
		'width': '100%',
		'height': toPixel(spaceh_unit)
	});
	centerspace.css({
		'border': '0px solid red',
		'position': 'absolute',
		'top': toPixel(spaceh_unit),
		'left': '0px',
		'width': '100%',
		'height': toPixel(ch)
	});
	bottomspace.css({
		'border': '0px solid green',
		'position': 'absolute',
		'top': toPixel(bottomspace_y),
		'left': '0px',
		'width': '100%',
		'height': toPixel(spaceh_unit)
	});

}

function setsize_landscape_sidefit(isUnit) {

	var leftspace = $('#leftspace');
	var centerspace = $('#centerspace');
	var rightspace = $('#rightspace');
	var cw = 0;
	if (isLandscape() && !isUnit) {
		var c1 = document.getElementById('c1');
		var c1q = $('#c1');
		var c2 = document.getElementById('c2');
		var c2q = $('#c2');
		cw = parseInt(c1q.css('width')) + parseInt(c2q.css('width'));
		//cw = parseInt(c1q.css('width')) + parseInt(c2q.css('width')) + 4;
	} else {
		var c1 = document.getElementById('c1');
		var c1q = $('#c1');
		//cw = c1.width;
		cw = parseInt(c1q.css('width'));
	}
	var spacew = Size.width() - cw;
	var spacew_unit = spacew / 2;
	var rightspace_x = spacew_unit + cw;

	var wh = Size.height();
	var ch = parseInt(c1q.css('height'));
	var center_top = parseInt((wh - ch) / 2);

	leftspace.css({
		'border': '0px solid blue',
		'position': 'absolute',
		'top': '0px',
		'left': '0px',
		'width': toPixel(spacew_unit),
		'height': '100%'
	});
	rightspace.css({
		'border': '0px solid green',
		'position': 'absolute',
		'top': '0px',
		'left': toPixel(rightspace_x),
		'width': toPixel(spacew_unit),
		'height': '100%'
	});
	centerspace.css({
		'border': '0px solid red',
		'position': 'absolute',
		'top': toPixel(center_top),
		'left': toPixel(spacew_unit),
		'width': toPixel(cw),
		'height': '100%'
	});
}

function setsize_landscape(isUnit) {
	var leftspace = $('#leftspace');
	var centerspace = $('#centerspace');
	var rightspace = $('#rightspace');
	var cw = 0;
	if (isLandscape() && !isUnit) {
		var c1 = document.getElementById('c1');
		var c1q = $('#c1');
		var c2 = document.getElementById('c2');
		var c2q = $('#c2');
		cw = parseInt(c1q.css('width')) + parseInt(c2q.css('width'));
		//cw = parseInt(c1q.css('width')) + parseInt(c2q.css('width')) + 4;
	} else {
		var c1 = document.getElementById('c1');
		var c1q = $('#c1');
		//cw = c1.width;
		cw = parseInt(c1q.css('width'));
	}
	var spacew = Size.width() - cw;
	var spacew_unit = spacew / 2;
	var rightspace_x = spacew_unit + cw;
	leftspace.css({
		'border': '0px solid blue',
		'position': 'absolute',
		'top': '0px',
		'left': '0px',
		'width': toPixel(spacew_unit),
		'height': '100%'
	});
	rightspace.css({
		'border': '0px solid green',
		'position': 'absolute',
		'top': '0px',
		'left': toPixel(rightspace_x),
		'width': toPixel(spacew_unit),
		'height': '100%'
	});
	centerspace.css({
		'border': '0px solid red',
		'position': 'absolute',
		'top': '0px',
		'left': toPixel(spacew_unit),
		'width': toPixel(cw),
		'height': '100%'
	});
}

function setcanvasback() {

	// #page1 height
	$("#page1").css("height", toPixel(Size.height() + CANVAS_MARGIN));

        var margin = CANVAS_MARGIN;
        var b = $("#canvas_back");
        var bhpx = toPixel(Size.height() + margin);
        var bwpx = toPixel(Size.width());
        b.css({
                position: 'absolute',
                top: '1px',
                left: '0px',
                height: bhpx,
                width: bwpx,
                'z-index': '1',
		'background-color': 'none',
        });
}

function setcanvas() {
	setcanvasback();
	if (isLandscape()) {
		setcanvas_landscape();
	} else {
		setcanvas_portrait();
	}
	$('.canvas-space').css({
		'background-color': 'none'
	});
}

function setcanvas_portrait() {

	$("#canvas_div").empty();

	// canvas
	var image_div = $('<div id="image_div" />');
	var topspace = $('<div class="canvas-space" id="topspace" />');
	var centerspace = $('<div class="canvas-space" id="centerspace" />');
	var bottomspace = $('<div class="canvas-space" id="bottomspace" />');
	image_div.append(topspace);

	var c1 = $('<canvas id="c1" />');
	centerspace.append(c1);

	image_div.append(centerspace);
	image_div.append(bottomspace);

	$("#canvas_div").append(image_div);

	setboxdiv();
	setBackFowardButton(false);

}

function setcanvas_landscape() {

	$("#canvas_div").empty();

	// canvas
	var image_div = $('<div id="image_div" />');
	var leftspace = $('<div class="canvas-space" id="leftspace" />');
	var centerspace = $('<div class="canvas-space" id="centerspace" />');
	var rightspace = $('<div class="canvas-space" id="rightspace" />');
	image_div.append(leftspace);
	var c1 = $('<canvas id="c1" />');
	var c2 = $('<canvas id="c2" />');
	if (pi.direction == 1) {
		centerspace.append(c2);
		centerspace.append(c1);
	} else {
		centerspace.append(c1);
		centerspace.append(c2);
	}

	image_div.append(centerspace);
	image_div.append(rightspace);

	$("#canvas_div").append(image_div);

	setboxdiv();
	setBackFowardButton(false);

}

function setcanvas_landscape_sidefit() {

	$("#canvas_div").empty();

	// canvas
	var image_div = $('<div id="image_div" />');
	var centerspace = $('<div class="canvas-space" id="centerspace" />');
	var topspace = $('<div class="canvas-space" id="topspace" />');
	var bottomspace = $('<div class="canvas-space" id="bottomspace" />');

	image_div.append(topspace);

	var c1 = $('<canvas id="c1" />');
	var c2 = $('<canvas id="c2" />');
	if (pi.direction == 1) {
		centerspace.append(c2);
		centerspace.append(c1);
	} else {
		centerspace.append(c1);
		centerspace.append(c2);
	}

	image_div.append(centerspace);
	image_div.append(bottomspace);

	$("#canvas_div").append(image_div);

	setboxdiv();
	setBackFowardButton(false);

}

function hideBackFowardButton() {
	var forward_div = $("#forward_button_div");
	var back_div = $("#back_button_div");
	forward_div.css({
		"display": "none"
	});
	back_div.css({
		"display": "none"
	});
}

function isLastPage(page) {

	// 1ページ対応
	if (pi.start == pi.end) {
		return true;
	}

	//var isCover = bookInfo["cover"];
	var isCover = pi.cover;
	var org = page;
	var ctmp = page;
	var isMaxPage = false;
	if (isLandscape()) {
		if (ctmp <= pi.end - 2) {
			if (isCover == 1) {
				if (ctmp == 1) {
					ctmp = 2;
				} else {
					ctmp += 2;
					if (ctmp % 2 == 1) {
						ctmp--;
					}
				}
			} else {
				ctmp += 2;
				if (ctmp % 2 == 0) {
					ctmp--;
				}
			}
		} else {
			if (isCover == 1) {
				if (pi.end % 2 == 1) {
					ctmp = pi.end - 1;
				} else {
					ctmp = pi.end;
				}
			} else {
				if (pi.end % 2 == 1) {
					ctmp = pi.end;
				} else {
					ctmp = pi.end - 1;
				}
			}
			if (org == ctmp) {
				isMaxPage = true;
			}
		}
	} else {
		if (ctmp < pi.end) {
			ctmp++;
		}
		if (ctmp == org && ctmp == pi.end) {
			isMaxPage = true;
		}
	}
	return isMaxPage;
}

/* old isLastPage(page)
function isLastPage(page) {
	var isCover = bookInfo["cover"];
	var org = page;
	var ctmp = page;
	var isMaxPage = false;
	if (isLandscape()) {
		if (ctmp <= maxpage - 2) {
			if (isCover == 1) {
				if (ctmp == 1) {
					ctmp = 2;
				} else {
					ctmp += 2;
					if (ctmp % 2 == 1) {
						ctmp--;
					}
				}
			} else {
				ctmp += 2;
				if (ctmp % 2 == 0) {
					ctmp--;
				}
			}
		} else {
			if (isCover == 1) {
				if (maxpage % 2 == 1) {
					ctmp = maxpage - 1;
				} else {
					ctmp = maxpage;
				}
			} else {
				if (maxpage % 2 == 1) {
					ctmp = maxpage;
				} else {
					ctmp = maxpage - 1;
				}
			}
			if (org == ctmp) {
				isMaxPage = true;
			}
		}
	} else {
		if (ctmp < maxpage) {
			ctmp++;
		}
		if (ctmp == org && ctmp == maxpage) {
			isMaxPage = true;
		}
	}
	return isMaxPage;
}
*/

function showBackFowardButton() {
	// left button
	var forward_div = $("#forward_button_div");
	var forward_img = $("#forward_button_img");
	// right button
	var back_div = $("#back_button_div");
	var back_img = $("#back_button_img");

	// 画像の初期値はnone
	forward_img.css({"display": "none"});
	back_img.css({"display": "none"});

	// divはdisplay: blockにする
	forward_div.css({"display": "block"});
	back_div.css({"display": "block"});

	// 画像のdisplayを制御
	if (currentPage > 1) {
		// 初期ページ以降は両方表示
		back_img.css({
			"display": "block"
		});
		forward_img.css({
			"display": "block"
		});
	} else {
		// 最初のページは進む方向のみ
		if (pi.direction == 1) {
			back_img.css({
				"display": "none"
			});
			forward_img.css({
				"display": "block"
			});
		} else {
			back_img.css({
				"display": "block"
			});
			forward_img.css({
				"display": "none"
			});
		}
	}

}

function setBackFowardButton(display) {

	var forward_div = $("#forward_button_div");
	var back_div = $("#back_button_div");

	var fdw = parseInt(forward_div.css("width"));
	var fdh = parseInt(forward_div.css("height"));

	var bdw = parseInt(back_div.css("width"));
	var bdh = parseInt(back_div.css("height"));

	var ww = Size.width();
	var wh = Size.height();

	var ftop = wh / 2 - fdh / 2;
	var fleft = 0;

	var btop = ftop;
	var bleft = ww - bdw;

	var padding = ww - fdw - bdw - 1;

	var disp = display ? "block" : "none";

	forward_div.css({
		"display": disp,
		"top": parseInt(ftop) + "px",
		"left": parseInt(fleft) + "px",
		"margin-right": parseInt(padding)
	});
	back_div.css({
		"display": disp,
		"top": parseInt(btop) + "px"
	});

	if (!backForwardButtonEventCreated) {

		$$("#forward_button_div").doubleTap(function() {
			event.preventDefault();
			event.stopPropagation();
		});

		$$("#back_button_div").doubleTap(function() {
			event.preventDefault();
			event.stopPropagation();
		});

		forward_div.bind('tap', function(e) {
			if (isPinching) {
				debuglog("forward_div tap");
				pagingInPinching = true;
				//nextpage();
				paging(true);
				//e.stopPropagation();
				return false;
			}
		});
		back_div.bind('tap', function(e) {
			if (isPinching) {
				debuglog("back_div tap");
				pagingInPinching = true;
				//prevpage();
				paging(false);
				//e.stopPropagation();
				return false;
			}
		});


		backForwardButtonEventCreated = true;
	}

}

// left == true, leftbox tap, or from left to right swipe
function paging(left) {

	// 描画中マークを取得
	// 描画中のページ捲りを抑止する
	var drawing = new DrawInProgress();
	if (drawing.isDrawing()) {
		debuglog("isDrawing = true, currentPage = " + currentPage);
		return;
	}
	debuglog("isDrawing = false, currentPage = " + currentPage);

	if (left) {
		if (pi.direction == 1) {
			nextpage();
		} else {
			prevpage();
		}
	} else {
		if (pi.direction == 1) {
			prevpage();
		} else {
			nextpage();
		}
	}

}

function setboxdiv() {

	if (isCreateBoxDiv) {
		$("#canvas_div").remove("#box_tap_parent");
		//return;
	}

	// 3 boxes
	var parent_divbox = $('<div id="box_tap_parent" />');
	var string_div = $('<div id="string_div" />');
	var leftbox = $('<div class="box-tap" id="box_left" />');
	var centerbox = $('<div class="box-tap" id="box_center" />');
	var rightbox = $('<div class="box-tap" id="box_right" />');

	// swipe
	parent_divbox.bind('swipeleft', function(e) {
		if (isPinching) {
			return;
		}
		if (currentPage > 0) {
			//prevpage();
			redraw(true);
			paging(false);
		}
	});
	parent_divbox.bind('swiperight', function(e) {
		if (isPinching) {
			return;
		}
		redraw(true);
		debuglog("swipe : before nextpage call");
		//nextpage();
		paging(true);
		debuglog("swipe : after nextpage call");
	});

	// tap
	leftbox.bind('tap', function(e) {
		debuglog("leftbox tap");
		if (isPinching) {
			return;
		}
		// for double-tap
		waitDoubleTap = true;
		var ptime = 0;
		var isLast = false;
		if (isLastPage(currentPage)) {
			ptime = 100;
			isLast = true;
		}
		setTimeout(function() {
			if (!waitDoubleTap) {
				return;
			}
			debuglog("leftbox tap(setTimeout)");
			e.preventDefault();
			e.stopPropagation();
			debuglog("tap : before nextpage call");
			//nextpage();
			redraw(true);
			paging(true);
			debuglog("tap : after nextpage call");
		}, DOUBLE_TAP_WAIT_TIME + ptime);
	});

	centerbox.bind('tap', function(e) {
		debuglog("centerbox tap");
		if (isPinching) {
			return;
		}

		// for double-tap
		waitDoubleTap = true;
		setTimeout(function() {
			if (!waitDoubleTap) {
				return;
			}
			redraw(false);
			debuglog("centerbox tap(setTimeout)");
			// same as old logic 'taphond'
			e.preventDefault();
			e.stopPropagation();
			if (showMenuFlag) {
				showMenuFlag = false;
				_tap();
			}
			if ((page3Bookmarks_num == 0) && (page4Bookmarks_del_num == 0) && (displayPopup == null)) {
				$("#headerbox_align").css('text-align', 'left');
				//$("#headerbox_title").text(bookInfo["title"]);
				$("#headerbox_title").text("");
				visibleHeader();
				visibleNavi();
				showMenuFlag = true;
			}
			invalidateBody();
		}, DOUBLE_TAP_WAIT_TIME);
	});

	rightbox.bind('tap', function(e) {
		debuglog("rightbox tap");
		if (isPinching) {
			return;
		}

		// for double-tap
		waitDoubleTap = true;
		setTimeout(function() {
			if (!waitDoubleTap) {
				return;
			}
			debuglog("rightbox tap(setTimeout)");
			e.preventDefault();
			e.stopPropagation();
			if (currentPage > 0) {
				//prevpage();
				redraw(true);
				paging(false);
				//displaypage(currentPage);
			}
			waitDoubleTap = false;
		}, DOUBLE_TAP_WAIT_TIME);
	});

	// css
	leftbox.css({
		'border': '0px solid cyan',
		'backGround-color': 'red',
		'position': 'absolute',
		'top': '0%',
		'left': '0%',
		'width': '30%',
		'height': '100%'
	});
	centerbox.css({
		'border': '0px solid magenta',
		'backGround-color': 'red',
		'position': 'absolute',
		'top': '0%',
		'left': '30%',
		'width': '40%',
		'height': '100%'
	});
	rightbox.css({
		'border': '0px solid yellow',
		'backGround-color': 'red',
		'position': 'absolute',
		'top': '0%',
		'left': '70%',
		'width': '30%',
		'height': '100%'
	});

	parent_divbox.css({
		'text-align': 'left',
		'position': 'absolute',
		'top': '0px',
		'left': '0px',
		'width': '100%',
		'height': '100%'
	});

	string_div.css({
		'margin': '15px 0 0 15px',
		'font-size': '0.8em',
		'opacity': '0.5'
	});

	parent_divbox.append(string_div);
	parent_divbox.append(leftbox);
	parent_divbox.append(centerbox);
	parent_divbox.append(rightbox);

	$("#canvas_div").append(parent_divbox);
	if (DEBUG) {
		var debug = $('<div id="new_debug" />');
		debug.css({
			'color': 'blue'
		});
		centerbox.append(debug);
	}

	isCreateBoxDiv = true;

	setScreenString();
}

function setScreenString(str) {

/*
	var string_div = $('#string_div');
	if (str !== undefined) {
		string_div.text(str);
	} else {
		//string_div.text(urlinfo.userid);
		string_div.text(urlinfo.speed);
	}
*/
}

function pinchingFinish(e) {
	// set to global
	isPinching = false;
}

function prevpage() {

	//var isCover = bookInfo["cover"];
	var isCover = pi.cover
	var org = currentPage;
	if (isLandscape()) {
		if (currentPage > 2) {
			currentPage -= 2;
			if (isCover == 1) {
				if (currentPage % 2 == 1) {
					currentPage--;
				}
			} else {
				if (currentPage % 2 == 0) {
					currentPage--;
				}
			}
		} else {
			if (isCover == 1) {
				if (currentPage == 2) {
					currentPage = 1;
				}
			} else {
				currentPage = 1;
			}
		}
	} else {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	//debuglog("prevpage : " + org + " -> " + currentPage);
	if (currentPage != org) {

		// 描画スタートをマーク
		// 描画中のページ捲りを抑止するため
		var drawStart = new DrawInProgress();
		drawStart.doInProgress();

		displaypage(currentPage);
		//loadImage(currentPage, dispFont, false, false);
	} else {
		_loadingiconHide();
	}
}

function nextpage() {

	//debuglog("nextpage called : current/maxpage = " + currentPage + "/" + maxpage);
	//var isCover = bookInfo["cover"];
	var isCover = pi.cover;
	var org = currentPage;
	var isMaxPage = false;
	if (isLandscape()) {
		if (currentPage <= pi.end - 2) {
			if (isCover == 1) {
				if (currentPage == 1) {
					currentPage = 2;
				} else {
					currentPage += 2;
					if (currentPage % 2 == 1) {
						currentPage--;
					}
				}
			} else {
				currentPage += 2;
				if (currentPage % 2 == 0) {
					currentPage--;
				}
			}
		} else {
			if (isCover == 1) {
				if (pi.end % 2 == 1) {
					currentPage = pi.end - 1;
					if (currentPage < 1) {
						currentPage = 1;
					}
				} else {
					currentPage = pi.end;
				}
			} else {
				if (pi.end % 2 == 1) {
					currentPage = pi.end;
				} else {
					currentPage = pi.end - 1;
				}
			}
			if (org == currentPage) {
				isMaxPage = true;
			}
		}
	} else {
		if (currentPage < pi.end) {
			currentPage++;
		}
		if (currentPage == org && currentPage == pi.end) {
			isMaxPage = true;
		}
	}
	//debuglog("nextpage : " + org + " -> " + currentPage + ", isMaxPage = " + isMaxPage);
	if (currentPage != org) {

		// 描画スタートをマーク
		// 描画中のページ捲りを抑止するため
		var drawStart = new DrawInProgress();
		drawStart.doInProgress();

		displaypage(currentPage);
		//loadImage(currentPage, dispFont, false, false);
	} else {
		_loadingiconHide();
		if (isMaxPage) {

			// for ios
			setPage1Height();

			if (showMenuFlag) {
				showMenuFlag = false;
				_tap();
			}

			debuglog("#page_end open");
			$("#page_end").popup("open");
			isUnread = false;
			setUnread();
		}
	}
}

/* old prevpage(), nextpage()
function prevpage() {

	var isCover = bookInfo["cover"];
	var org = currentPage;
	if (isLandscape()) {
		if (currentPage > 2) {
			currentPage -= 2;
			if (isCover == 1) {
				if (currentPage % 2 == 1) {
					currentPage--;
				}
			} else {
				if (currentPage % 2 == 0) {
					currentPage--;
				}
			}
		} else {
			if (isCover == 1) {
				if (currentPage == 2) {
					currentPage = 1;
				}
			} else {
				currentPage = 1;
			}
		}
	} else {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	//debuglog("prevpage : " + org + " -> " + currentPage);
	if (currentPage != org) {
		displaypage(currentPage);
		//loadImage(currentPage, dispFont, false, false);
	} else {
		_loadingiconHide();
	}
}
function nextpage() {

	//debuglog("nextpage called : current/maxpage = " + currentPage + "/" + maxpage);
	var isCover = bookInfo["cover"];
	var org = currentPage;
	var isMaxPage = false;
	if (isLandscape()) {
		if (currentPage <= maxpage - 2) {
			if (isCover == 1) {
				if (currentPage == 1) {
					currentPage = 2;
				} else {
					currentPage += 2;
					if (currentPage % 2 == 1) {
						currentPage--;
					}
				}
			} else {
				currentPage += 2;
				if (currentPage % 2 == 0) {
					currentPage--;
				}
			}
		} else {
			if (isCover == 1) {
				if (maxpage % 2 == 1) {
					currentPage = maxpage - 1;
				} else {
					currentPage = maxpage;
				}
			} else {
				if (maxpage % 2 == 1) {
					currentPage = maxpage;
				} else {
					currentPage = maxpage - 1;
				}
			}
			if (org == currentPage) {
				isMaxPage = true;
			}
		}
	} else {
		if (currentPage < maxpage) {
			currentPage++;
		}
		if (currentPage == org && currentPage == maxpage) {
			isMaxPage = true;
		}
	}
	//debuglog("nextpage : " + org + " -> " + currentPage + ", isMaxPage = " + isMaxPage);
	if (currentPage != org) {
		displaypage(currentPage);
		//loadImage(currentPage, dispFont, false, false);
	} else {
		_loadingiconHide();
		if (isMaxPage) {

			// for ios
			setPage1Height();

			if (showMenuFlag) {
				showMenuFlag = false;
				_tap();
			}

			debuglog("#page_end open");
			$("#page_end").popup("open");
			isUnread = false;
			setUnread();
		}
	}
}
*/

function getiframeimage(id) {
	var iframename = "iframe_" + id;
	var idoc = $('iframe#iframe_' + id).contents();
	var img = idoc.find('img');
	return img;
}

function getiframeimagew(id, attr) {
	var iframename = "iframe_" + id;
	var idoc = $('iframe#iframe_' + id).contents();
	var ret = idoc.find('div#imgw_' + id).text();
	return ret;
}

function getiframeimageh(id, attr) {
	var iframename = "iframe_" + id;
	var idoc = $('iframe#iframe_' + id).contents();
	var ret = idoc.find('div#imgh_' + id).text();
	return ret;
}

function newdebug_update(txt) {
	if (DEBUG) {
		$('#new_debug').text("(" + debug_no + ", " + txt + ")");
		debug_no++;
	}
}

function newdebug_add(txt) {
	if (DEBUG) {
		var org = $('#new_debug').text();
		$('#new_debug').text(org + "\n" + "(" + debug_no + ", " + txt + ")");
		debug_no++;
	}
}

function isSideFit(img, id, u) {

	var isUnit = false;
	if (u !== undefined) {
		isUnit = u;
	} else {
		isUnit = isUnitPage(id);
	}

	var isize = getTrueSize(img);
	var iw = isize.width;
	var ih = isize.height;
	//var imgratio = img.width / img.height;
	var imgratio = iw / ih;
	var wh = Size.height();
	var ww = Size.width();
	var windowratio = Size.width() / wh;
	if (isLandscape() && !isUnit) {
		windowratio = (Size.width() / 2) / wh;
	}
	var ret = (imgratio > windowratio);
	debuglog("isSideFit = " + ret + ", imgratio = " + imgratio + ", windowratio = " + windowratio);
	return (imgratio > windowratio);
}

//function copyimg(id, called, atimes) {}
function copyimg(copyimgArgs) {

	var id = copyimgArgs.id;
	var called = copyimgArgs.called;
	var atimes = copyimgArgs.atimes;

	// 表示画像がダウンロード済みであれば、次のダウンロードをキックするための関数
	var nextFunc = copyimgArgs.next;

	debuglog("[copyimg] : id = " + id + ", currentPage = " + currentPage + ", call = " + called);

	var isUnit = isUnitPage(id);

	// 描画スタートをマーク
	// 描画中のページ捲りを抑止するため
	// この箇所での抑止は念のため
	var drawStart = new DrawInProgress();
	drawStart.doInProgress();

	var times = 0;
	if (atimes !== undefined) {
		times = atimes;
	}

	if (!isUnit && isLandscape() && id < pi.end) {

		// 見開き表示時
		if (!hasDownloadedImage(id) || !hasDownloadedImage(id + 1)) {

			// リトライ回数に達した以降はエラーダイアログ
			if (times > COPYIMG_RETRY_TIMES) {

				// 描画終了とする
				var drawEnd = new DrawInProgress();
				drawEnd.doOutOfProgress();

				// ワーニング表示
				// 電波細いのが原因と考えられる
				showWarningPopup2(
					warningDefine("W5001"),
					function() {
						displaypage(id);
					},
					function() {
						urlinfo.returnUrl();
					}
				);

				return;
			}

			// 先読みしていない場合は1秒待機
			//_loadingiconShow(null);

			// ダウンロード状況取得
			var progress = progressDownloadedImage(id);
			debuglog("download progress = " + progress + ", id = " + id);
			if (progress <= 0) {
				var retry_info = getTargetHeaderInfo(id);
				var retry_imgsrc = retry_info["img"];
				var retry_json = retry_info["x"];
				var addiframeArgs = {
					id: id,
					imgsrc: retry_imgsrc,
					loadfunc: null,
					json: retry_json,
					next: null
				};
				//addiframe(id, retry_imgsrc, null, retry_json);
				addiframe(addiframeArgs);
			}
			var progress2 = progressDownloadedImage(id + 1);
			debuglog("download progress2 = " + progress2 + ", id = " + id);
			if (progress2 <= 0) {
				var retry_info = getTargetHeaderInfo(id + 1);
				var retry_imgsrc = retry_info["img"];
				var retry_json = retry_info["x"];
				var addiframeArgs = {
					id: id + 1,
					imgsrc: retry_imgsrc,
					loadfunc: null,
					json: retry_json,
					next: null
				};
				//addiframe(id + 1, retry_imgsrc, null, retry_json);
				addiframe(addiframeArgs);
			}
			debuglog("Landscape mode retry[" + times + "], id = " + id);
			setTimeout(function() {
				//copyimg(id, called, ++times);
				copyimgArgs.atimes++;
				copyimg(copyimgArgs);
			}, COPYIMG_RETRY_WAIT);
			return;
		}
	} else {

		// 単ページ表示時
		if (!hasDownloadedImage(id)) {

			// リトライ回数に達した以降はエラーダイアログ
			if (times > COPYIMG_RETRY_TIMES) {
				// 描画終了とする
				var drawEnd = new DrawInProgress();
				drawEnd.doOutOfProgress();

				// ワーニング表示
				// 電波細いのが原因と考えられる
				showWarningPopup2(
					warningDefine("W5001"),
					function() {
						displaypage(id);
					},
					function() {
						urlinfo.returnUrl();
					}
				);

				return;
			}

			// 先読みしていない場合は1秒待機
			//_loadingiconShow(null);

			// ダウンロード状況取得
			var progress = progressDownloadedImage(id);
			debuglog("download progress = " + progress + ", id = " + id);
			if (progress <= 0) {
				var retry_info = getTargetHeaderInfo(id);
				var retry_imgsrc = retry_info["img"];
				var retry_json = retry_info["x"];
				var addiframeArgs = {
					id: id,
					imgsrc: retry_imgsrc,
					loadfunc: null,
					json: retry_json,
					next: nextFunc
				};
				//addiframe(id, retry_imgsrc, null, retry_json);
				addiframe(addiframeArgs);
			}
			debuglog("Unitpage mode retry[" + times + "], id = " + id);
			setTimeout(function() {
				//copyimg(id, called, ++times);
				copyimgArgs.atimes++;
				copyimg(copyimgArgs);
			}, COPYIMG_RETRY_WAIT);
			return;
		}
	}

	// ピンチアウト中のページめくり
	// 拡大率を保ち、ページの右上を表示する
	if (pagingInPinching) {
		if (pi.direction == 1) {
			var tScale = myScroll.scale;
			var scrollw = $("#scroller").width();
			var x = (tScale - 1) * scrollw * (-1);
			var y = 0;
			var topspacediv = document.getElementById("topspace");
			var rightspacediv = document.getElementById("rightspace");
			if (topspacediv != null) {
				var cssheight = parseInt($("#topspace").css("height"));
				y += ((tScale) * cssheight * (-1));
			}
			if (rightspacediv != null) {
				var csswidth = parseInt($("#rightspace").css("width"));
				x += ((tScale) * csswidth);
			}
/* ページめくり時に縮小しない */
			hideBackFowardButton();
			myScroll.scrollTo(x, y, tScale, 0);
			showBackFowardButton();
/**/
/* ページめくり時に縮小する
			hideBackFowardButton();
			myScroll.zoom(0, 0, 1, 0);
			setTimeout(function() {
				myScroll.zoom(0, 0, tScale, 0);
				myScroll.scrollTo(x, y, tScale, 0);
				showBackFowardButton();
			}, 500);
*/
		} else {
			var tScale = myScroll.scale;
			var scrollw = $("#scroller").width();
			var x = 0;
			var y = 0;
			var topspacediv = document.getElementById("topspace");
			var leftspacediv = document.getElementById("leftspace");
			if (topspacediv != null) {
				var cssheight = parseInt($("#topspace").css("height"));
				y += ((tScale) * cssheight * (-1));
			}
			if (leftspacediv != null) {
				var csswidth = parseInt($("#leftspace").css("width"));
				x = ((tScale) * csswidth * (-1));
			}
/* ページめくり時に縮小しない */
			hideBackFowardButton();
			myScroll.scrollTo(x, y, tScale, 0);
			showBackFowardButton();
/**/
/* ページめくり時に縮小する
			hideBackFowardButton();
			myScroll.zoom(0, 0, 1, 0);
			setTimeout(function() {
				myScroll.zoom(0, 0, tScale, 0);
				myScroll.scrollTo(x, y, tScale, 0);
				showBackFowardButton();
			}, 500);
*/
		}
	} else {
		// hide buttons
		hideBackFowardButton();

		// default scale
		isPinching = false;
		myScroll.zoom(0, 0, 1, 0);
		myScroll.vScroll = false;
	}
	pagingInPinching = false;

	// ページをめくった時はメニューを非表示にする対応
	if (showMenuFlag) {
		showMenuFlag = false;
		_tap();
	}

	// ここにたどり着いた場合は先読みダウンロードを行う
	nextFunc();

	var img1;
	var p = id;
	var ww = Size.width();
	var wh = Size.height();
	if (isLandscape()) {

		var fr1 = document.getElementById("iframe_" + p);
		var frimg1 = fr1.contentWindow.document.getElementById("img_" + p);
		var c1 = document.getElementById('c1');
		var c1q = $('#c1');
		var ctx1 = c1.getContext('2d');

		c1q.attr('class', 'content_canvas');

		// 画像サイズ取得
		var i1w = getiframeimagew(p);
		var i1h = getiframeimageh(p);

		if (isSideFit(frimg1, p)) {
			var c1w = ww / 2;
			var c1h = (i1h * c1w) / i1w;
			c1q.css({
				'width': toPixel(c1w),
				'height': toPixel(c1h)
			});
			c1.width = i1w;
			c1.height = parseInt(i1h);
		} else {
			var c1h = wh;
			var c1w = (i1w * c1h) / i1h;
			c1q.css({
				'width': toPixel(c1w),
				'height': toPixel(c1h)
			});
			c1.width = i1w;
			c1.height = parseInt(i1h) ;
		}

		if (DEBUG) {
			c1.width = parseInt(c1.width * CANVAS_RATIO);
			c1.height = parseInt(c1.height * CANVAS_RATIO);
		}
		drawImage2Canvas(ctx1, frimg1, c1w, c1h, p);
		c1q.css({
			'opacity': 1.0
		});

		img1 = frimg1;

		//if (id + 1 <= maxpage && !isUnit) {
		if (id + 1 <= pi.end && !isUnit) {
			p++;
			var fr2 = document.getElementById("iframe_" + p);
			var frimg2 = fr2.contentWindow.document.getElementById("img_" + p);
			var c2 = document.getElementById('c2');
			var c2q = $('#c2');
			var ctx2 = c2.getContext('2d');

			c2q.attr('class', 'content_canvas');

			var i2w = getiframeimagew(p);
			var i2h = getiframeimageh(p);
			if (isSideFit(frimg2, p)) {
				var c2w = ww / 2;
				var c2h = (i2h * c2w) / i2w;
				c2q.css({
					'width': toPixel(c2w),
					'height': toPixel(c2h)
				});
				c2.width = i2w;
				c2.height = parseInt(i2h) ;
			} else {
				var c2h = wh;
				var c2w = (i2w * c2h) / i2h;
				c2q.css({
					'width': toPixel(c2w),
					'height': toPixel(c2h)
				});
				c2.width = i2w;
				c2.height = parseInt(i2h) ;
			}
			if (DEBUG) {
				c2.width = parseInt(c2.width * CANVAS_RATIO);
				c2.height = parseInt(c2.height * CANVAS_RATIO);
			}
			drawImage2Canvas(ctx2, frimg2, c2w, c2h, p);
			c2q.css({
				'opacity': 1.0
			});
		} else {
			var c2 = document.getElementById('c2');
			var c2q = $('#c2');
			c2.width = 0;
			c2.height = 0;
			c2q.css({
				'width': '',
				'height': ''
			});
		}
	} else {
		var c1 = document.getElementById('c1');
		var fr1 = document.getElementById("iframe_" + p);
		var frimg1 = fr1.contentWindow.document.getElementById("img_" + p);
		var c1q = $('#c1');
		var ctx1 = c1.getContext('2d');

		c1q.attr('class', 'content_canvas');

		var i1w = getiframeimagew(p);
		var i1h = getiframeimageh(p);

		if (isSideFit(frimg1, p)) {
			var c1w = ww;
			var c1h = (i1h * c1w) / i1w;
			c1q.css({
				'width': toPixel(c1w),
				'height': toPixel(c1h)
			});
			c1.width = i1w;
			c1.height = parseInt(i1h) ;


		} else {
			var c1h = wh;
			var c1w = (i1w * c1h) / i1h;
			c1q.css({
				'width': toPixel(c1w),
				'height': toPixel(c1h)
			});
			c1.width = i1w;
			c1.height = parseInt(i1h) ;

		}

		if (DEBUG) {
			c1.width = parseInt(c1.width * CANVAS_RATIO);
			c1.height = parseInt(c1.height * CANVAS_RATIO);
		}

		drawImage2Canvas(ctx1, frimg1, c1w, c1h, p);

		img1 = frimg1;
	}
	setsizeWithImage(img1, isUnit);
	//setsize();
	_loadingiconHide();

	// ここに来たら描画中マークを消す
	var drawEnd = new DrawInProgress();
	drawEnd.doOutOfProgress();

	setTimeout(function() {
		$("#canvas_div").css({
			'opacity': 0.99
		});
		setTimeout(function() {
			$("#canvas_div").css({
				'opacity': 1.0
			});
		}, 30);
	}, 30);

}

function drawImage2Canvas(ctx, img, w, h, id, times) {

	// 初期化
	if (times === undefined || times === null) {
		times = 0;
	}

	// canvas context2d smoothing off
	if (ctx.imageSmoothingEnabled !== undefined) {
		ctx.imageSmoothingEnabled = false;
	}
	if (ctx.webkitImageSmoothingEnabled !== undefined) {
		ctx.webkitImageSmoothingEnabled = false;
	}
	if (ctx.mozImageSmoothingEnabled !== undefined) {
		ctx.mozImageSmoothingEnabled = false;
	}

	debuglog("7 drawImage2Canvas w = " + w);
	debuglog("7 drawImage2Canvas h = " + h);

	var iframename = "iframe_" + id;
	var iframe = $("iframe#" + iframename);
	var iw = getiframeimagew(id);
	var ih = getiframeimageh(id);
	var idoc = iframe.contents();
	var divj = idoc.find('div#json_' + id);
	var jsonstr = divj.text();
	var json = null;
	if (jsonstr != NO_JSON_DATA) {
		try {
			// jsonstrがjson形式ではないことを考慮する
			json = $.parseJSON(jsonstr);
		} catch (e) {
			// 例外発生時はNO_JSON_DATAを設定し、再取得
			divj.text(NO_JSON_DATA);
			drawImage2Canvas(ctx, img, w, h, id, ++times);

			// 再帰呼び出し先で描画されるので、この場合はreturn
			return;
		}
		//newdebug_add(" w / json");
	} else {
		// jsonの取得ができていない場合を考慮して再取得
		var id2 = pi.realPage(id);
		var info = getTargetHeaderInfo(id2 - 1);
		var json = info["x"];
		var imgsrc = info["img"];

		var imgurl = urlinfo.imageUrl(imgsrc, json);

		// 5回までリトライする
		if (times < 5) {
			_loadingiconShow(null);
/*
			$.ajax({
				url: imgurl,
				type: 'get',
				cache: false,
				dataType: 'json',
				timeout: AJAX_TIMEOUT,
				async: false,
				success: function(data, status) {
					divj.text(data);
					_loadingiconHide();
					// 再帰的に呼び出す
					drawImage2Canvas(ctx, img, w, h, id, ++times);
				},
				error: function(xhr, status, e) {
					divj.text(NO_JSON_DATA);
					_loadingiconHide();
					// 再帰的に呼び出す
					drawImage2Canvas(ctx, img, w, h, id, ++times);
				}
			});
*/
			$.ajax({
				url: imgurl,
				type: 'get',
				dataType: 'json',
				cache: false,
				timeout: AJAX_TIMEOUT,
				async: false
			}).done(function(rjson, textStatus, jqXHR) {
				if (rjson !== null) {
					var rjsontext = JSON.stringify(rjson["x"], null, "");
					divj.text(rjsontext);
					_loadingiconHide();
				}
			}).fail(function(jqXHR, textStatus, errorThrown) {
				divj.text(NO_JSON_DATA);
				_loadingiconHide();
			}).always(function(data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
				// 再帰的に呼び出す
				drawImage2Canvas(ctx, img, w, h, id, ++times);
			});

			// 以降処理しない
			return;
		} else {

			// 5回リトライしても取得できない場合はメッセージ表示
			ctx.font = "20pt Arial";
			ctx.fillStyle = "black";
			ctx.fillText("コンテンツの表示に失敗しました。", 80, 80);
			ctx.fillText("大変お手数をおかけ致しますが、", 80, 120);
			ctx.fillText("削除後に再ダウンロードを", 80, 160);
			ctx.fillText("お願いいたします。", 80, 200);

			debuglog("drawImage2Canvas times = " + times);
			return;
		}
	}

	debuglog("drawImage2Canvas times = " + times);

	if (json != null) {
		var blocksw = json[0][0];
		var blocksh = json[0][1];

		// iOSでは、jpg画像から高さを切り出すとき、
		// 高さが大きくなる不具合があるため、最下部が表示できないところに
		// 対応する必要有(sh値を調整)
		var shd = 0;
		if (isAppleDevice) {
			shd = -1;
		}

		// canvasをクリア
		//ctx.clearRect(0, 0, w, h);

		for (cnt = 1; cnt <= blocksw * blocksh; cnt++) {
			var sx = parseInt(json[cnt][2]);
			var sy = parseInt(json[cnt][3]);
			var sw = parseInt(json[cnt][4]);
			var sh = parseInt(json[cnt][5]);
			var dx = parseInt(json[cnt][0]);
			var dy = parseInt(json[cnt][1]);
			var dw = sw;
			var dh = sh;

			ctx.drawImage(img,
				sx, sy, sw, sh + shd, dx, dy, dw, dh
			);
/*
			if (DEBUG && false) {
				var fontSize = 20;
				ctx.font = fontSize + "pt Arial";
				ctx.fillStyle = "red";
				ctx.fillText(cnt, dx, dy + fontSize);
				//ctx.fillText(cnt, sx, sy + fontSize);
			}
*/
		}

	} else {
		// このルートは通らないが残しておく
		ctx.drawImage(img, 0, 0, iw, ih);
	}

}

function removeiframe(id) {
	var iframename = "iframe_" + id;
	$("iframe#" + iframename).remove();
}

//function addiframe(id, imgsrc, loadfunc, json) {}
function addiframe(addiframeArgs) {

	var id = addiframeArgs.id;
	var imgsrc = addiframeArgs.imgsrc;
	var loadfunc = addiframeArgs.loadfunc;
	var loadfuncArgs = addiframeArgs.loadfuncArgs;
	var json = addiframeArgs.json;
	var nextFunc = addiframeArgs.next;
	var atimes = 0;
	if (addiframeArgs.atimes !== undefined) {
		atimes = addiframeArgs.atimes;
	} else {
		addiframeArgs.atimes = 0;
	}

	var iframename = "iframe_" + id;
	var iframe = $("iframe#" + iframename);
	var idoc = null;
	if (!isSakiyomi(id)) {
		var iframe2 = $('body').append('<iframe width="0" height="0" frameborder="0" id="' + iframename + '" style="display: none;"><body></body></iframe>').find('> :last-child');
		iframe2.load(function() {
			debuglog("iframe#" + iframename + " loaded");
		});
		debuglog("iframe#" + iframename + " contents() before(1)");
		idoc = iframe2.contents();
		debuglog("iframe#" + iframename + " contents() after(1)");
		idoc[0].open();
		idoc[0].close();
		idoc.find('body').append('<img id="img_' + id + '" alt="' + id + '" />');
		idoc.find('body').append('<div id="imgw_' + id + '" />');
		idoc.find('body').append('<div id="imgh_' + id + '" />');
		idoc.find('body').append('<div id="json_' + id + '" />');
		idoc.find('body').append('<canvas id="canvas_' + id + '" />');
		idoc.find('body').append('<div id="dataurl_' + id + '" />');
		idoc.find('body').append('<div id="downloaded_' + id + '" />');

		if (DEBUG) {
			idoc.find('body').append('<div id="debug_' + id + '" />');
		}
	} else {
		debuglog("iframe#" + iframename + " contents() before(2)");
		idoc = iframe.contents();
		debuglog("iframe#" + iframename + " contents() after(2)");
	}

	var img = idoc.find('img#img_' + id);
	var divw = idoc.find('div#imgw_' + id);
	var divh = idoc.find('div#imgh_' + id);
	var divj = idoc.find('div#json_' + id);
	var divd = idoc.find('div#downloaded_' + id);
	divd.text("0");

	var idurl = urlinfo.imageUrl(imgsrc, json);
	$.ajax({
		url: idurl,
		type: 'get',
		dataType: 'json',
		timeout: AJAX_TIMEOUT,
		async: false
	}).done(function(rjson, textStatus, jqXHR) {
		var xc = jqXHR.getResponseHeader('X-Error-Code');
		var xdef = jqXHR.getResponseHeader('X-Error-def');
		var errors = [];
		if (xc != "0") {
			debuglog("json get error(timeout) : id = " + id + "xc = " + xc);
			divd.text("0");
			errors.push(errorDefine(xdef));
			_loadingiconHide();
			showErrorPopup(errors);
			return;
		}
		if (rjson === null) {
			debuglog("json get error(null) : id = " + id);
			divd.text("0");

			// エラーではないのにjsonがnullの場合はリトライ
			// 5回リトライであきらめる
			if (atimes <= IMGDL_RETRY_TIMES) {
				addiframeArgs.atimes++;
				addiframe(addiframeArgs);
				return;
			}

			// ワーニング表示
			// 電波細いのが原因と考えられる
			showWarningPopup2(
				warningDefine("W5001"),
				function() {
					displaypage(id);
				},
				function() {
					urlinfo.returnUrl();
				}
			);
			return;
		}
		var rimgsrc = rjson["image"];
		var rjsontext = JSON.stringify(rjson["x"], null, "");
		divd.text("1");
		img.bind('load', function() {
			divw.text(this.naturalWidth);
			divh.text(this.naturalHeight);
			divj.text(rjsontext);
			divd.text("2");
			if (loadfunc != null) {
				//loadfunc(id, "addiframe");
				loadfunc(loadfuncArgs);
			} else {
				//debuglog("loadfunc is null id = " + id);
			}
			debuglog("img.load done : id = " + id);
		});
		img.error(function(e) {
			var ee = e;
			divd.text("0");
			debuglog("img.load error : id = " + id);
		});
		img.removeAttr('src');
		img.attr('src', rimgsrc);

		// 10秒後にダウンロードできていない場合はprogress=0とする
		// それでも続いている場合は、loadのイベントで2になる
		setTimeout(function() {
			if (divd.text() == "1") {
				divd.text("0");
			}
		}, 10000);
	}).fail(function(jqXHR, textStatus, errorThrown) {
		debuglog("addiframe: img json get error : id = " + id + ", atimes = " + atimes);
		divd.text("0");
		divj.text(NO_JSON_DATA);

		//addiframe(id, imgsrc, loadfunc, json);
		//addiframe(addiframeArgs);

		// エラーではないのにjsonがnullの場合はリトライ
		// 5回リトライであきらめる
		if (atimes <= IMGDL_RETRY_TIMES) {
			addiframeArgs.atimes++;
			addiframe(addiframeArgs);
			return;
		}

		// ワーニング表示
		// 電波細いのが原因と考えられる
		showWarningPopup2(
			warningDefine("W5001"),
			function() {
				displaypage(id);
			},
			function() {
				urlinfo.returnUrl();
			}
		);

		return;

	}).always(function(data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
	});
}

function hasDownloadedImage(page) {
	if (!isSakiyomi(page)) {
		return false;
	}
	var iframename = "iframe_" + page;
	var iframe = $("iframe#" + iframename);
	var idoc = iframe.contents();
	var divd = idoc.find('div#downloaded_' + page);
	var ret = false;
	if (divd.text() == "2") {
		ret = true;
	}
	return ret;
}
function progressDownloadedImage(page) {
	if (!isSakiyomi(page)) {
		return -1;
	}
	var iframename = "iframe_" + page;
	var iframe = $("iframe#" + iframename);
	var idoc = iframe.contents();
	var divd = idoc.find('div#downloaded_' + page);
	var ret = parseInt(divd.text());
	return ret;
}

function isSakiyomi(page) {
	var iframename = "iframe_" + page;
	var frame = document.getElementById(iframename);
	var ret = (frame != null);
	return ret;
}

function remove_prevpage(page) {

	if (page <= SAKIYOMI_BACK - 1) {
		return;
	}
	for (i = page - SAKIYOMI_BACK - 1; i >= 1; i--) {
		if (isSakiyomi(i)) {
			removeiframe(i);
		}
	}

}

function sakiyomi_start_prev(showpagenum) {
	var startPage = showpagenum - SAKIYOMI_BACK;
	var endPage = showpagenum - 1;
	if (startPage < 1) {
		startPage = 1;
	}
/*
	if (endPage > maxpage) {
		endPage = maxpage;
	}
*/
	if (endPage > pi.end) {
		endPage = pi.end;
	}
	if (startPage > endPage) {
		return;
	}
	for (i = startPage; i <= endPage; i++) {
		if (!isSakiyomi(i)) {
			startPage = i;
			break;
		}
	}
	//getImage4Sakiyomi(startPage, startPage, endPage, -1);
	getImage4Sakiyomi(endPage, startPage, endPage, -1);
}

function sakiyomi_start(showpagenum) {
	var startPage = showpagenum;
	var endPage = currentPage + SAKIYOMI_FORWARD;
/*
	if (endPage > maxpage) {
		endPage = maxpage;
	}
*/
	if (endPage > pi.end) {
		endPage = pi.end;
	}
/*
	for (i = startPage; i <= endPage; i++) {
		if (!isSakiyomi(i)) {
			startPage = i;
			break;
		}
	}
	getImage4Sakiyomi(startPage, startPage, endPage, -1);
*/
	for (i = endPage; i >= startPage; i--) {
		if (!isSakiyomi(i)) {
			endPage = i;
			break;
		}
	}
	getImage4Sakiyomi(endPage, startPage, endPage, -1);
}

function getImage4Sakiyomi(xhrtarget, start, end, savetarget) {

	if (xhrtarget >= start && xhrtarget <= end) {
		var xhr = new XMLHttpRequest();
		var dummyurl = "/dummy?id=" + xhrtarget;
		xhr.open("GET", dummyurl, false);
		xhr.overrideMimeType("text/plain; charset=x-user-defined");
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200 || xhr.status == 0) {
					//getImage4Sakiyomi(xhrtarget + 1, start, end, xhrtarget);
					getImage4Sakiyomi(xhrtarget - 1, start, end, xhrtarget);
				}
			}
		}
		xhr.send(null);
	}

	if (savetarget >= 0 && !isSakiyomi(savetarget)) {
		var savetarget2 = pi.realPage(savetarget);
		var info = getTargetHeaderInfo(savetarget2);
		var imgsrc = info["img"];
		var json = info["x"];
		addiframe(savetarget, imgsrc, null, json);
	}

}

//function display2piece(showpage, nextFunc) {}
function display2piece(args) {
	var showpage = args.id;
	var nextFunc = args.next;

	showpage--;
	var copyimgArgs = {
		id: showpage,
		called: "display2piece",
		atimes: 0,
		next: nextFunc
	};
	//copyimg(showpage, "display2piece");
	copyimg(copyimgArgs);
}

//function getImageSync3(showpage, nextFunc) {}
function getImageSync3(args) {

	var showpage = args.id;
	var nextFunc = args.next;
	
	showpage++;
	if (showpage > pi.end) {
		return;
	}
	//if (isSakiyomi(showpage)) {
	if (hasDownloadedImage(showpage)) {
		//display2piece(showpage, nextFunc);
		display2piece({
			id: showpage,
			next: nextFunc
		});
		return;
	}
	var xhr = new XMLHttpRequest();

	var showpage2 = pi.realPage(showpage);
	var info = getTargetHeaderInfo(showpage2);
	var imgsrc = info["img"];
	var json = info["x"];
	var dummyurl = "/dummy?id=" + showpage;

	//addiframe(showpage, imgsrc, copyimg, json);
	//addiframe(showpage, imgsrc, display2piece, json);
	var addiframeArgs = {
		id: showpage,
		imgsrc: imgsrc,
		loadfunc: display2piece,
		loadfuncArgs: {
			id: showpage,
			next: nextFunc
		},
		json: json,
		next: nextFunc
	};
	addiframe(addiframeArgs);
}

function getImageSync2(showpage, nextFunc) {
	if (showpage > pi.end) {
		return;
	}
	//if (isSakiyomi(showpage)) {
	if (hasDownloadedImage(showpage)) {
		//getImageSync3(showpage, nextFunc);
		getImageSync3({
			id: showpage,
			next: nextFunc
		});
		return;
	}
	var xhr = new XMLHttpRequest();

	var showpage2 = pi.realPage(showpage);
	var info = getTargetHeaderInfo(showpage2);
	var imgsrc = info["img"];
	var json = info["x"];
	var dummyurl = "/dummy?id=" + showpage;

	//addiframe(showpage, imgsrc, copyimg, json);
	//addiframe(showpage, imgsrc, getImageSync3, json);
	var addiframeArgs = {
		id: showpage,
		imgsrc: imgsrc,
		loadfunc: getImageSync3,
		loadfuncArgs: {
			id: showpage,
			next: nextFunc
		},
		json: json,
		next: nextFunc
	};
	addiframe(addiframeArgs);
}

function getTargetHeaderInfo(page) {
	var showpage2 = pi.realPage(page);
	var h1 = headerInfo["pgs"];
	var h2 = h1["pg"];
	var h3 = h2[showpage2 - 1];
	var ret = null;
	if (h3 !== undefined) {
		ret = h3;
	} else {
		ret = h2;
	}
	return ret;
}

function getImageSync(showpage, called, nextFunc) {
	//if (isSakiyomi(showpage)) {
	if (hasDownloadedImage(showpage)) {
		var copyimgArgs = {
			id: showpage,
			called: "getImageSync:isSakiyomi=true",
			atimes: 0,
			next: nextFunc
		};
		//copyimg(showpage, "getImageSync:isSakiyomi=true");

		// ここでの呼び出しは、非同期先読み中、ダウンロード未完了の場合があるので
		// ダウンロード完了後に呼び出しとする
		copyimg(copyimgArgs);
		return;
	}
	var xhr = new XMLHttpRequest();
	var showpage2 = pi.realPage(showpage);
	var info = getTargetHeaderInfo(showpage2);
	var imgsrc = info["img"];
	var json = info["x"];
	var dummyurl = "/dummy?id=" + showpage;

	var copyimgArgs = {
		id: showpage,
		called: "getImageSync->addiframe",
		atimes: 0,
		next: nextFunc
	};
	var addiframeArgs = {
		id: showpage,
		imgsrc: imgsrc,
		loadfunc: copyimg,
		loadfuncArgs: copyimgArgs,
		json: json,
		next: nextFunc
	};
	//addiframe(showpage, imgsrc, copyimg, json);
	addiframe(addiframeArgs);
}

function displaypage(page) {
	_loadingiconShow(null);
	var isUnit = isUnitPage(page);
	var sakiyomiPage = page + 1;

	//canvasを作り直す
	//setcanvas();

	if (isLandscape() && !isUnit) {
		sakiyomiPage++;
		//getImageSync2(page);
		getImageSync2(page, function() {
			removePages(page);
			sakiyomiSequencial(sakiyomiPage, page);
		});
	} else {
		//getImageSync(page, "displaypage");
		getImageSync(page, "displaypage", function() {
			removePages(page);
			sakiyomiSequencial(sakiyomiPage, page);
		});
	}
	setPage();
/*
	setTimeout(function() {
		//sakiyomi_start(sakiyomiPage);
		//remove_prevpage(page);
		//sakiyomi_start_prev(page);
		removePages(page);
		sakiyomiSequencial(sakiyomiPage, page);
	}, 1);
*/
}

function removePages(page) {

	// 前
	for (p = page - SAKIYOMI_BACK - 1; p > 0; p--) {
		if (isSakiyomi(p)) {
			removeiframe(p);
		}
	}

	// 後
	for (p = page + SAKIYOMI_FORWARD + 1; p <= pi.end; p++) {
		if (isSakiyomi(p)) {
			removeiframe(p);
		}
	}
}

function DrawInProgress() {

	var instance;
	DrawInProgress = function DrawInProgress() {
		return instance;
	};

	DrawInProgress.prototype = this;
	instance = new DrawInProgress();
	instance.constructor = DrawInProgress;
	instance.inProgress = false;

	this.isDrawing = function() {
		debuglog("isDrawing : instance.inProgress = " + instance.inProgress);
		return instance.inProgress;
	}

	this.doInProgress = function() {
		instance.inProgress = true;
		debuglog("doInProgress : instance.inProgress = " + instance.inProgress);
	}

	this.doOutOfProgress = function() {
		instance.inProgress = false;
		debuglog("doOutOfProgress : instance.inProgress = " + instance.inProgress);
	}

}

var Sakiyomi = function(id) {

	this.id = id;
	this.retry = 0;

	this.getRtries = function() {
		return this.retry;
	}

	this.increament = function() {
		this.retry++;
		return this.retry;
	}

}

function SakiyomiManager() {

	var instance;
	SakiyomiManager = function SakiyomiManager() {
		return instance;
	};

	SakiyomiManager.prototype = this;
	instance = new SakiyomiManager();
	instance.constructor = SakiyomiManager;
	instance.queueForward = new Array();
	instance.queueBack = new Array();
	instance.executingDownload = null;

	instance.downloadInProgress = false;

	this.setExecuting = function(downloader) {
		if (downloader.constructor !== ImageDownloadChain) {
			return;
		}
		instance.executingDownload = downloader;
	}

	this.getExecuting = function() {
		return instance.executingDownload;
	}

	this.removeExecuting = function() {
		instance.executingDownload = null;
	}

	this.doInProgress = function() {
		instance.downloadInProgress = true;
		debuglog("doInProgress : instance.downloadInProgress = " + instance.downloadInProgress);
	}

	this.doOutOfProgress = function() {
		instance.downloadInProgress = false;
		debuglog("doInProgress : instance.downloadInProgress = " + instance.downloadInProgress);
	}

	this.isDownloading = function() {
		return instance.downloadInProgress;
	}

	this.allResetRetry = function() {
		for (__i = 0; __i < instance.queueForward.length; __i++) {
			instance.queueForward[__i].retry = 0;
		}
		for (__i = 0; __i < instance.queueBack.length; __i++) {
			instance.queueBack[__i].retry = 0;
		}
	}

	this.hasQueue = function(check) {

		if (check.constructor !== Sakiyomi) {
			return false;
		}

		for (__i = 0; __i < instance.queueForward.length; __i++) {
			if (instance.queueForward[__i].id == check.id) {
				return true;
			}
		}
		for (__i = 0; __i < instance.queueBack.length; __i++) {
			if (instance.queueBack[__i].id == check.id) {
				return true;
			}
		}
		return false;
	}

	this.list = function() {
		var ret = Array();
		for (__i = 0; __i < instance.queueForward.length; __i++) {
			ret.push(instance.queueForward[__i]);
		}
		for (__i = 0; __i < instance.queueBack.length; __i++) {
			ret.push(instance.queueBack[__i]);
		}
		return ret;
	}

	this.enqueue = function(add, isForward) {
		if (add.constructor !== Sakiyomi) {
			return;
		}
		if (isForward) {
			instance.queueForward.push(add);
		} else {
			instance.queueBack.push(add);
		}
	}

	this.dequeue = function() {
/*
		if (instance.queueForward.length > 0) {
			return instance.queueForward.shift();
		} else if (instance.queueBack.length > 0) {
			return instance.queueBack.shift();
		}
*/

		// リトライ回数を超えている場合はqueueから出さない
		// この関数を通ってnullを返す場合、全てのダウンロードが終了しているとみなす
		var forwardId = -1;
		for (__i = 0; __i < instance.queueForward.length; __i++) {
			if (instance.queueForward[__i].retry > SAKIYOMI_RETRIES) {
				continue;
			}
			forwardId = __i;
			break;
		}
		if (forwardId != -1) {
			var retarr = instance.queueForward.splice(forwardId, 1);
			return retarr[0];
		}

		var backId = -1;
		for (__i = 0; __i < instance.queueBack.length; __i++) {
			if (instance.queueBack[__i].retry > SAKIYOMI_RETRIES) {
				continue;
			}
			backId = __i;
			break;
		}
		if (backId != -1) {
			var retarr = instance.queueBack.splice(backId, 1);
			return retarr[0];
		}

		// ダウンロード中をOFF
		instance.downloadInProgress = false;
		return null;
	}

	this.size = function() {
		return instance.queueForward.length + instance.queueBack.length;
	}
}

function sakiyomiSequencial(forwardPage, backPage) {

	var queue = new SakiyomiManager();
	var f_startPage = forwardPage;
	if (f_startPage > pi.end) {
		f_startPage = pi.end;
	}
	var f_endPage = f_startPage + SAKIYOMI_FORWARD - 1;
	if (f_endPage > pi.end) {
		f_endPage = pi.end;
	}

	var b_startPage = backPage - 1;
	if (b_startPage < 1) {
		b_startPage = 1;
	}
	var b_endPage = b_startPage - SAKIYOMI_BACK + 1;
	if (b_endPage < 1) {
		b_endPage = 1;
	}

	for (i = f_startPage; i <= f_endPage; i++) {
		var so = new Sakiyomi(i);
		if (!queue.hasQueue(so)) {
			queue.enqueue(so, true);
		}
	}
	for (i = b_startPage; i >= b_endPage; i--) {
		// 前ページの場合は先読みをしていない場合のみqueueへ追加
		var so = new Sakiyomi(i);
		if (!queue.hasQueue(so) && !hasDownloadedImage(i)) {
			queue.enqueue(so, false);
		}
	}

	// ここを通る場合はリトライをリセットする
	queue.allResetRetry();
/*
	if (!queue.isDownloading()) {
		var target = queue.dequeue();
		var startDownloader = new ImageDownloadChain(target);
		queue.doInProgress();
		startDownloader.doDownload();
	}
*/
	var executing = queue.getExecuting();
	if (executing == null) {
		var target = queue.dequeue();
		var startDownloader = new ImageDownloadChain(target);
		queue.doInProgress();
		startDownloader.doDownload();
	} else {
		if (!searchDownloadingInQueue()) {
			executing.doDownload();
		}
	}
}

var ImageDownloadChain = function (target) {

	this.target = target;
	var targetId = target.id;

	var showpage2 = pi.realPage(targetId);
	var info = getTargetHeaderInfo(showpage2);
	var imgsrc = info["img"];
	var json = info["x"];

	this.doDownload = function() {

		var queue = new SakiyomiManager();
		//queue.doInProgress();
		queue.setExecuting(this);

		// 画像ダウンロードを始める前に、リトライ回数をアップ
		target.retry++;

		var id = targetId;
		var iframename = "iframe_" + id;
		var iframe = $("iframe#" + iframename);
		var idoc = iframe.contents();
		if (!isSakiyomi(id)) {
			var iframe = $('body').append('<iframe width="0" height="0" frameborder="0" id="' + iframename + '" style="display: none;"><body></body></iframe>').find('> :last-child');
			idoc = iframe.contents();
			idoc[0].open();
			idoc[0].close();
			idoc.find('body').append('<img id="img_' + id + '" alt="' + id + '" />');
			idoc.find('body').append('<div id="imgw_' + id + '" />');
			idoc.find('body').append('<div id="imgh_' + id + '" />');
			idoc.find('body').append('<div id="json_' + id + '" />');
			idoc.find('body').append('<canvas id="canvas_' + id + '" />');
			idoc.find('body').append('<div id="dataurl_' + id + '" />');
			idoc.find('body').append('<div id="downloaded_' + id + '" />');
			if (DEBUG) {
				idoc.find('body').append('<div id="debug_' + id + '" />');
			}
		}

		var img = idoc.find('img#img_' + id);
		var divw = idoc.find('div#imgw_' + id);
		var divh = idoc.find('div#imgh_' + id);
		var divj = idoc.find('div#json_' + id);
		var divd = idoc.find('div#downloaded_' + id);

		// download中の場合はスキップ
		// imgのload完了で次の画像をダウンロードする想定だが
		// 描画対象ダウンロードを考慮して次の画像へ
/*
		if (divd.text() == "1") {
			debuglog("ImageDownloadChain target id = " + id + ", download status = 1");
			var nextId = queue.dequeue();
			if (nextId != null) {
				var next = new ImageDownloadChain(nextId);
				next.doDownload();
			} else {
				queue.doOutOfProgress();
			}
			return;
		}
*/
		// download済の場合は次の画像へ
		if (divd.text() == "2") {
			debuglog("ImageDownloadChain target id = " + id + ", download status = 2");
			var nextId = queue.dequeue();
			if (nextId != null) {
				var next = new ImageDownloadChain(nextId);
				next.doDownload();
			} else {
				queue.doOutOfProgress();
				queue.removeExecuting();
			}
			return;
		}

		// download状況初期化
		divd.text("0");

		var idurl = urlinfo.imageUrl(imgsrc, json);
		$.ajax({
			url: idurl,
			type: 'get',
			dataType: 'json',
			timeout: AJAX_TIMEOUT,
			async: true
		}).done(function(rjson, textStatus, jqXHR) {
			var xc = jqXHR.getResponseHeader('X-Error-Code');
			var xdef = jqXHR.getResponseHeader('X-Error-def');
			var errors = [];
			if (xc != "0") {
				debuglog("json get error(timeout) : id = " + id);

				if (!queue.hasQueue(target)) {
					queue.enqueue(target, (target.id >= currentPage));
				}
				var nextId = queue.dequeue();
				if (nextId != null) {
					var next = new ImageDownloadChain(nextId);
					next.doDownload();
				} else {
					queue.removeExecuting();
				}
				queue.doOutOfProgress();

				divd.text("0");
				errors.push(errorDefine(xdef));
				_loadingiconHide();
				showErrorPopup(errors);
				return;
			}
			if (rjson === null) {
				debuglog("json get error(null) : id = " + id);

				// エラーではないのにjsonがnullの場合はキューの最後に追加して次へ
				if (!queue.hasQueue(target)) {
					queue.enqueue(target, (target.id >= currentPage));
				}
				var nextId = queue.dequeue();
				if (nextId != null) {
					var next = new ImageDownloadChain(nextId);
					next.doDownload();
				} else {
					queue.removeExecuting();
				}
				queue.doOutOfProgress();

				divd.text("0");
				return;
			}
			var rimgsrc = rjson["image"];
			var rjsontext = JSON.stringify(rjson["x"], null, "");
			divd.text("1");
			img.bind('load', function() {
				divw.text(this.naturalWidth);
				divh.text(this.naturalHeight);
				divj.text(rjsontext);
				divd.text("2");

				var nextId = queue.dequeue();
				if (nextId != null) {
					var next = new ImageDownloadChain(nextId);
					next.doDownload();
				} else {
					queue.doOutOfProgress();
					queue.removeExecuting();
				}
				queue.doOutOfProgress();
				debuglog("img.load done : id = " + id);
			});
			img.error(function(e) {
				var ee = e;

				// imgのダウンロード失敗の場合はキューへ再追加
				if (!queue.hasQueue(target)) {
					queue.enqueue(target, (target.id >= currentPage));
				}
				var nextId = queue.dequeue();
				if (nextId != null) {
					var next = new ImageDownloadChain(nextId);
					next.doDownload();
				} else {
					queue.removeExecuting();
				}
				queue.doOutOfProgress();
				divd.text("0");
				debuglog("img.load error : id = " + id);
			});
			img.removeAttr('src');
			img.attr('src', rimgsrc);

		}).fail(function(jqXHR, textStatus, errorThrown) {
			debuglog("ImageDownloadChain: img json get error : id = " + id);
			divd.text("0");
			divj.text(NO_JSON_DATA);

			// ここでエラーになった場合は、queueに追加して次のダウンロードを行う
			if (!queue.hasQueue(target)) {
				queue.enqueue(target, (target.id >= currentPage));
			}

			// 次の画像ダウンロードを行う
			// 対象が無い場合は先読み終了
			var nextId = queue.dequeue();
			if (nextId != null) {
				var next = new ImageDownloadChain(nextId);
				next.doDownload();
			} else {
				queue.removeExecuting();
			}
			queue.doOutOfProgress();
		}).always(function(data_or_jqXHR, textStatus, jqXHR_or_errorThrown) {
		});
	}
}

function searchDownloadingInQueue() {

	var queue = new SakiyomiManager();
	var checkList = queue.list();

	for (__i = 0; __i < checkList.length; __i++) {
		var id = checkList[__i].id;
		var iframename = "iframe_" + id;
		var iframe = $("iframe#" + iframename);
		var idoc = iframe.contents();
		if (isSakiyomi(id)) {
			var divd = idoc.find('div#downloaded_' + id);
			if (divd.text() == "0" || divd.text() == "1") {
				return true;
			}
		}
	}

	return false;
}

function isUnitPage(page) {
	//var isCover = bookInfo["cover"];
	var isCover = pi.cover;
	if (page == 1 && isCover == 1) {
		return true;
	}

	//if (page == maxpage) {
	if (page == pi.end) {
		if (isCover == 1) {
			return (page % 2 == 0);
		} else {
			return (page % 2 == 1);
		}
	}

	return false;
	/*
		var uflag = headerInfo["pgs"]["pg"][page - 1]["u"];
		if (uflag == 1) {
			return true;
		}

		if (page == maxpage) {
			return true;
		}
		var uflag_next = headerInfo["pgs"]["pg"][page]["u"];
		if (uflag_next == 1) {
			return true;
		}

		return false;
	*/
}

function setPage1Height() {
	var ph = $("#page1_content").css("height");
	var margin = CANVAS_MARGIN;
	$("#page1").css("height", toPixel(ph + margin));
	$("#page1").css("min-height", ph);
}

function getOrientation() {
	if (Math.abs(window.orientation) === 90) {
		return 90;
	}
	return 0;
}

function ios_height() {
	//var ret = $(window).height();
	//portraitの場合1px空いてしまうのでwindow.innerHeightを使用
	var ret = window.innerHeight;
	if (Math.abs(window.orientation) === 90) {
		//ret = screen.width;
		ret = window.innerHeight;
	}
	return ret;
}

function pageInfo() {
/*
	var min = minpage;
	var max = maxpage;
*/
	var min = urlinfo.minpage;
	var max = urlinfo.maxpage;
	var start = 1;
	var end = max - min + 1;
	var bookmarkpath = urlinfo.params["contents"] + "/min/" + min + "/max/" + max + "/bookmark/";
	var unreadpath = urlinfo.params["contents"] + "/min/" + min + "/max/" + max + "/unread/";
	var cover = bookInfo["cover"];
	var direction = bookInfo["direction"];
	if (min != 1) {
		cover = 0;
	}
	if (urlinfo.params["iscover"] !== undefined) {
		cover = urlinfo.params["iscover"];
	}
	return {
		min: min,
		max: max,
		start: start,
		end: end,
		cover: cover,
		direction: direction,
		bookmarkpath: bookmarkpath,
		unreadpath: unreadpath,
		realPage: function(current) {
			return current + min - 1;
		}
	};
}

function isAppleDevice() {
	var ret = false;
	var agent = navigator.userAgent;
	if (-1 != agent.search(/iPhone/)) {
		ret = true;
	} else if (-1 != agent.search(/iPad/)) {
		ret = true;
	} else if (-1 != agent.search(/iPad/)) {
		ret = true;
	}
	return ret;
}

var Size = {
	height: function() {
		debuglog("Size.height() = " + window.innerHeight);
		return window.innerHeight;
	},
	width: function() {
		debuglog("Size.width() = " + window.innerWidth);
		return window.innerWidth;
	},
}

var SizeKeeper = (function() {
	var instance;
	function init() {
		return {
			height: Size.height(),
			width: Size.width(),
			update: function() {
				this.height = Size.height();
				this.width = Size.width();
			},
		}
	}
	return {
		getInstance: function() {
			if (!instance) {
				instance = init();
			}
			return instance;
		},
	}
})();

function redraw(paging) {

	var sk = SizeKeeper.getInstance();
	if (sk.height == Size.height()) {
		sk.update();
		return;
	}

	sk.update();
	window.scrollTo(0, 1);

	var wh = Size.height();
	var margin = CANVAS_MARGIN;
	$("#page1_content").css("height", (wh + 1) + "px");
	$("#page1").css("height", (wh + margin) + "px");

	// for body
	$("body").css("height", wh + "px");

	// popup re-center
	if (displayPopup != null) {
		popUpCenterPosition(displayPopup);
	}

	setcanvas();

	if (paging) {
		return;
	}

	if (currentPage > 1 && currentPage % 2 == 1) {
		currentPage--;
	}
	var copyimgArgs = {
		id: currentPage,
		called: "redraw",
		atimes: 0,
		next: function() {}
	};
	copyimg(copyimgArgs);
}

function scrollToWithPopupClose() {

	// for iphone
	if (deviceType2 != IOS_DEVICE) {
		return;
	}

	// for landscape
	if (!isLandscape()) {
		return;
	}

	var margin = CANVAS_MARGIN;
	openLid(margin);
	var t = 500;
	setTimeout(function() {
		window.scrollTo(0, 1);
		closeLid();
	}, t);
}

function redrawWithResize() {
	var margin = CANVAS_MARGIN;
	openLid(margin);
	setcanvas();
	var t = 500;
	setTimeout(function() {
		window.scrollTo(0, 1);
		closeLid();
	}, t);
}

function openLid(margin) {
	var l = $("#lid");
	var bhpx = toPixel(Size.height() + margin);
	var bwpx = toPixel(Size.width());

	l.css({
		position: 'absolute',
		display: 'block',
		top: '0px',
		left: '0px',
		height: bhpx,
		width: bwpx,
		background: 'white',
		'z-index': '9999',
	});
}

function closeLid() {
	var l = $("#lid");
	l.fadeOut(500, function() {
		l.css({
			position: 'absolute',
			display: 'none',
			height: '0px',
			width: '0px',
			background: 'none',
			'z-index': '10',
		});
	});
}
