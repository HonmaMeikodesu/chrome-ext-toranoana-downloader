/**
 * Whistle proxy rules
 * /(.*)/index.php/ http://127.0.0.1:8080/front/viewer.html
 * /https://viewer.toraebook.com/bookinfo_php73.php/ http://127.0.0.1:8080/front/bookInfo.xml
 * /https://viewer.toraebook.com/image_php73.php/ http://127.0.0.1:8080/1/directive.json
 */
const express = require('express');

const app = express();

app.use((req, res, next) => {
    // for image request, sleep for 2 seconds, randomly throw error for test cases
    const delay = 2000;
    const shouldThrow = Math.random() < 0.2;

    res.setHeader("X-Error-Code", "0");

    if (req.url.includes("img.jfif")) {
        setTimeout(() => {
            if (shouldThrow) {
                res.setHeader("X-Error-Code", "1");
                res.status(500).send("Error");
            } else {
                return next();
            }
        }, delay);
    } else {
        return next();
    }
})

app.use(express.static(__dirname + '/src/mock'));


app.listen(8080, () => console.log('Mock server started on port 8080'));