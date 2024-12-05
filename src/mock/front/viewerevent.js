
var isShowError = false;
function showErrorPopup(info) {
	if (info !== undefined && info.length >= 1) {

		console.log("isShowError = " + isShowError);
		if (isShowError) {
			return true;
		}
		isShowError = true;
		$("#page_error0_button").bind("tap", function() {
			urlinfo.returnUrl();
		});

		var message = info[0].message + "(" + info[0].code + ")";
		$("#pageError0_message").html(message);
		$("#pageError0").popup("open");
		return true;
	}
	return false;
}

var isShowWarning = false;
function showWarningPopup(message, button1_caption, button2_caption, button1_func, button2_func, code) {

	console.log("isShowWarning = " + isShowWarning);
	if (isShowWarning) {
		return;
	}

	isShowWarning = true;
	$("#page_warning_button1").bind("tap", function(e) {
		e.preventDefault();
		e.stopPropagation();
		$("#pageWarning").popup("close");
		if (button1_func !== undefined) {
			button1_func();
		}
		isShowWarning = false;
	});
	$("#page_warning_button2").bind("tap", function(e) {
		e.preventDefault();
		e.stopPropagation();
		$("#pageWarning").popup("close");
		if (button2_func !== undefined) {
			button2_func();
		}
		isShowWarning = false;
	});

	var omessage = message;
	if (code !== undefined) {
		omessage = message + "(" + code + ")";
	}

	$("#page_warning_message").html(omessage);

	$("#page_warning_button1").text(button1_caption);
	$("#page_warning_button2").text(button2_caption);

	$("#pageWarning").popup("open");

}

function showWarningPopup2(warning, button1_func, button2_func) {
	var code = warning.code;
	var message = warning.message;
	var button1 = warning.button1;
	var button2 = warning.button2;
	showWarningPopup(message, button1, button2, button1_func, button2_func, code);
}

function viewerevent() {

	//<!-- new viewer logic start -->
	$(window).on("orientationchange",function(){
		// iframe内でビューアが動作する前提とすると
		// iOSで横向きの時に高さが取得できないため
		// 回転検知->親フレームでiframe内の高さを再設定->resizeイベントで高さ取得
		// の動作とする
		window.parent.postMessage("orientationchange", urlinfo.domain);
	});

/*
	$(window).resize(function() {
		//window.scrollTo(0, 1);
		//setcanvas();
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
		//copyimg(currentPage);
		copyimg(copyimgArgs);
		//loadImage(currentPage, 0, false, false);
	});
*/
	//<!-- new viewer logic end -->

	// old logic
	$(document).bind("mobileinit", function() {
	$.mobile.hashListeningEnabled = false;
	$.mobile.ignoreContentEnabled = true;

	$.event.special.swipe.horizontalDistanceThreshold = 30;
	$.event.special.tap.tapholdThreshold = 750;

	$.mobile.loadingMessage = "読み込み中...";
	$.mobile.pageLoadErrorMessage = "ページの取得に失敗しました。";
	});

	window.onload = function() {

		if (showErrorPopup(errorInfo)) {
			return;
		}
/*
		if (errorInfo !== undefined && errorInfo.length >= 1) {

			$("#page_error0_button").bind("tap", function() {
				//window.parent.postMessage("viewerfinish", urlinfo.domain);
				urlinfo.returnUrl();
			});

			var message = errorInfo[0].message + "(" + errorInfo[0].code + ")";
			$("#pageError0_message").html(message);
			$("#pageError0").popup("open");
			return;
		}
*/

		if (headerInfo == null || bookInfo == null) {
			$("#page_error0_button").on({
				vmousedown: function(event, ui) {
					$(this).focus();
				},
				vmouseup: function(event, ui) {
					$(this).blur();
				}
			});

			$("#page_error0_button").bind("tap", function() {
				//window.parent.postMessage("viewerfinish", urlinfo.domain);
				urlinfo.returnUrl();
			});

			var message = "ファイルの読み込みに失敗しました。ファイルが破損している可能性があります。削除後に再ダウンロードをしてください。";
			if (errorInfo && errorInfo.count >= 1) {
				message = errorInfo[0].message + "(" + errorInfo[0].code + ")";
			}

			//$("#pageError0_message").html("ファイルの読み込みに失敗しました。ファイルが破損している可能性があります。削除後に再ダウンロードをしてください。");
			$("#pageError0_message").html(message);
			$("#pageError0").popup("open");
			return;
		}

		setTimeout(scrollTo, 100, 0, 1);
		//$("#headerbox_title").text(bookInfo["title"]);
		$("#headerbox_title").text("");

		//<!-- new viewer logic start -->
			//setcanvas();
			redrawWithResize();
			//var showpage = 1;
			//displaypage(showpage);
		//<!-- new viewer logic end -->

	// window.onload end
	}

	var toc = false;

	$(function(){
	$('#headerbox').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#headerbox').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#headerbox_align').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#headerbox_align').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#viewer').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#viewer').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#navbox').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#navbox').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page0_button1').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page0_button1').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page0_button2').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page0_button2').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page2_content').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page2_content').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page2_close').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page2_close').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page2ImgLarge').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page2ImgLarge').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page2ImgMiddle').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page2ImgMiddle').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page2ImgSmall').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page2ImgSmall').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page2_button').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page2_button').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_content').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_content').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_close').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_close').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_dialog_content').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_dialog_content').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_dialog_button1').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_dialog_button1').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_dialog_button2').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_dialog_button2').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_content').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_content').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_close').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_close').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_dialog_content').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_dialog_content').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_dialog_button1').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_dialog_button1').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_dialog_button2').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_dialog_button2').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_content').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_content').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_close').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_close').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_end').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_end').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_next').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_next').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_prev').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_prev').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_top').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_top').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_slider').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_slider').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_button1').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_button1').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_button2').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5_button2').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page6_close').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page6_close').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page7_content').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page7_content').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page7_close').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page7_close').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_end_content').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_end_content').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_end_button1').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_end_button1').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_end_button2').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_end_button2').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_end_button3').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_end_button3').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_error_content').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_error_content').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_error_button').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_error_button').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_error2_content').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_error2_content').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#pageError2_close').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#pageError2_close').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_error2_button').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_error2_button').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#pageError3_close').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#pageError3_close').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_error3_button').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_error3_button').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});

	$('#blank').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#blank').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	});

	$(function(){
	$('#page2-screen').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page2-screen').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3-screen').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3-screen').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_dialog-screen').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_dialog-screen').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4-screen').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4-screen').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_dialog-screen').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_dialog-screen').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5-screen').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page5-screen').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page7-screen').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page7-screen').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_end-screen').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page_end-screen').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#pageError-screen').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#pageError-screen').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#pageError2-screen').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#pageError2-screen').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#pageError3-screen').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#pageError3-screen').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	});

	$('#page3_bookmarks1').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_bookmarks1').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});

	$('#page3_bookmarks2').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_bookmarks2').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});

	$('#page3_bookmarks3').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page3_bookmarks3').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});

	$('#page4_bookmarks1').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_bookmarks1').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_bookmarks1_del').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_bookmarks1_del').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});

	$('#page4_bookmarks2').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_bookmarks2').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_bookmarks2_del').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_bookmarks2_del').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});


	$('#page4_bookmarks3').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_bookmarks3').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_bookmarks3_del').bind("touchstart", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});
	$('#page4_bookmarks3_del').bind("touchend", function(e) {
	e = e.originalEvent;
	e.preventDefault();
	return true;
	});



}

