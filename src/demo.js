var json = [
    [
        4,
        10,
        -1,
        -1,
        -1,
        -1
    ],
    [
        0,
        512,
        0,
        0,
        "256",
        "128"
    ],
    [
        512,
        0,
        0,
        128,
        "256",
        "128"
    ],
    [
        512,
        256,
        0,
        256,
        "256",
        "128"
    ],
    [
        256,
        1024,
        0,
        384,
        "256",
        "128"
    ],
    [
        256,
        128,
        0,
        512,
        "256",
        "128"
    ],
    [
        256,
        896,
        0,
        640,
        "256",
        "128"
    ],
    [
        512,
        384,
        0,
        768,
        "256",
        "128"
    ],
    [
        0,
        128,
        0,
        896,
        "256",
        "128"
    ],
    [
        512,
        128,
        0,
        1024,
        "256",
        "128"
    ],
    [
        256,
        1152,
        0,
        1152,
        "256",
        "128"
    ],
    [
        512,
        1024,
        256,
        0,
        "256",
        "128"
    ],
    [
        0,
        640,
        256,
        128,
        "256",
        "128"
    ],
    [
        0,
        1024,
        256,
        256,
        "256",
        "128"
    ],
    [
        256,
        512,
        256,
        384,
        "256",
        "128"
    ],
    [
        256,
        768,
        256,
        512,
        "256",
        "128"
    ],
    [
        512,
        1152,
        256,
        640,
        "256",
        "128"
    ],
    [
        256,
        640,
        256,
        768,
        "256",
        "128"
    ],
    [
        256,
        256,
        256,
        896,
        "256",
        "128"
    ],
    [
        0,
        0,
        256,
        1024,
        "256",
        "128"
    ],
    [
        256,
        0,
        256,
        1152,
        "256",
        "128"
    ],
    [
        512,
        768,
        512,
        0,
        "256",
        "128"
    ],
    [
        256,
        384,
        512,
        128,
        "256",
        "128"
    ],
    [
        0,
        384,
        512,
        256,
        "256",
        "128"
    ],
    [
        0,
        768,
        512,
        384,
        "256",
        "128"
    ],
    [
        512,
        512,
        512,
        512,
        "256",
        "128"
    ],
    [
        0,
        1152,
        512,
        640,
        "256",
        "128"
    ],
    [
        0,
        256,
        512,
        768,
        "256",
        "128"
    ],
    [
        512,
        640,
        512,
        896,
        "256",
        "128"
    ],
    [
        512,
        896,
        512,
        1024,
        "256",
        "128"
    ],
    [
        0,
        896,
        512,
        1152,
        "256",
        "128"
    ],
    [
        768,
        256,
        768,
        0,
        137,
        "128"
    ],
    [
        768,
        128,
        768,
        128,
        137,
        "128"
    ],
    [
        768,
        512,
        768,
        256,
        137,
        "128"
    ],
    [
        768,
        1152,
        768,
        384,
        137,
        "128"
    ],
    [
        768,
        896,
        768,
        512,
        137,
        "128"
    ],
    [
        768,
        768,
        768,
        640,
        137,
        "128"
    ],
    [
        768,
        640,
        768,
        768,
        137,
        "128"
    ],
    [
        768,
        384,
        768,
        896,
        137,
        "128"
    ],
    [
        768,
        1024,
        768,
        1024,
        137,
        "128"
    ],
    [
        768,
        0,
        768,
        1152,
        137,
        "128"
    ],
    [
        905,
        1280,
        -1,
        -1,
        -1,
        -1
    ]
];

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