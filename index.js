const express = require('express');
const app = express();
app.get('/', (req, res) => {
    console.log('test');
})

app.listen(8800, () => {
    console.log("server listening on 8800");
})