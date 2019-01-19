
var express  = require("express"),
    app  = express(),
    ejs = require('ejs'),

    http = require("http").Server(app);

app.use(express.json());
app.use("/assets/css", express.static("./assets/css"))
app.use("/assets/js", express.static("./assets/js"))
app.use("/assets/images", express.static("./assets/images"))
app.use("/assets/fonts", express.static("./assets/fonts"))
app.use("/plugins", express.static("./plugins"))
var storage_images = require('filestorage').create('/assets/pictures/');
console.log(express.static('./js'))


const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ properties: [], count: 0 })
  .write()


const fileUpload = require('express-fileupload')
app.use(fileUpload())


console.log("Server started");

const adminRoutes  = require('./site/admin/admin');
app.use('/admin', adminRoutes)


app.get("/", function(req, res) {
   // get properties
   var t = db.get('properties')
   .sortBy('id')
   .value()
   //console.log(t);
   res.render('index.ejs', {
      properties : t,
  
     
    });
   //res.sendFile(__dirname + "/index.html")
})

app.post('/upload', function(req, res) {
   if (Object.keys(req.files).length == 0) {
     return res.status(400).send('No files were uploaded.');
   }
 
   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
   let sampleFile = req.files.sampleFile;
 
   // Use the mv() method to place the file somewhere on your server
   sampleFile.mv('./assets/images/pictures/' + sampleFile.name, function(err) {

    // get count 
    var id =   db.get('properties')
         .size()
         .value()
    id = id + 1
    db.get('properties')
      .push({ id: id, name: 'property ' + id, file: 'assets/images/pictures/' + sampleFile.name , type: 'Rent', description: '2 bdr/ bath', location: {address: '48 west mead', city: 'kingston 9'} })
      .write()

    // Increment count
    db.update('count', n => n + 1)
      .write()
     if (err)
       return res.status(500).send(err);
 
     res.send('File uploaded!');
   });
 });
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ${port}'));