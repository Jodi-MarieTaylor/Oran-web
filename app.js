
var express  = require("express"),
    app  = express(),
    ejs = require('ejs'),

    http = require("http").Server(app);

app.use(express.json());
app.use("/assets/css", express.static("./assets/css"))
app.use("/assets/js", express.static("./assets/js"))
app.use("/assets/images", express.static("./assets/images"))
app.use("/assets/fonts", express.static("./assets/fonts"))
app.use("/assets/js", express.static(__dirname + '/js'));
console.log(express.static('./js'))

console.log("Server started");
app.get("/", function(req, res) {
 res.sendFile(__dirname + "/index.html")
})
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ${port}'));