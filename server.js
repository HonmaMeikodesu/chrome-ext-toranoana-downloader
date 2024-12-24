/**
 * Whistle proxy rules
 * /(.*)/index.php/ http://127.0.0.1:8080/front/viewer.html
 * /https://viewer.toraebook.com/bookinfo_php73.php/ http://127.0.0.1:8080/front/bookInfo.xml
 * /https://viewer.toraebook.com/image_php73.php/ http://127.0.0.1:8080/1/directive.json
 */
const express = require('express');

const app = express();

app.use(express.static(__dirname + '/src/mock'));

app.listen(8080, () => console.log('Mock server started on port 8080'));