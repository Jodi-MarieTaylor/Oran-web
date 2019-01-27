
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
var nodemailer = require('nodemailer');

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


app.get("/admin/properties/manage", function(req, res) {
    // get properties
    var t = db.get('properties')
    .sortBy('id')
    .value()
    //console.log(t);
    res.render('admin-manage.ejs', {
       properties : t,
   
      
     });
    //res.sendFile(__dirname + "/index.html")
 })
 app.get('/admin', function(req, res) {
  

   res.redirect('/admin/properties/manage');

})



app.get("/property/:id", function(req, res) {
    // get properties
    console.log("in here")
    var id = parseInt(req.params.id)
    var t = db.get('properties')
    .find({ id: id })
    .value()
    console.log(t);
    //let jsonData = JSON.parse(t); 
    res.send(t);


    //res.sendFile(__dirname + "/index.html")
 })
 app.get('/admin', function(req, res) {
  

   res.redirect('/admin/properties/manage');

})
 app.get('/delete/:id', function(req, res) {
     var id = parseInt(req.params.id)
    var t = db.get('properties')
    .remove({ id: id })
    .write()

    
    // Decrement count
    db.update('count', n => n - 1)
      .write()
    

    res.redirect('/admin/properties/manage');

 })

app.post('/upload', function(req, res) {
   if (Object.keys(req.files).length == 0) {
     return res.status(400).send('No files were uploaded.');
   }
 
   //upload main image
   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
   let sampleFile = req.files.sampleFile;
 
   
   // Use the mv() method to place the file somewhere on your server
   sampleFile.mv('./assets/images/pictures/' + sampleFile.name, function(err) {
    if (err)
        return res.status(500).send(err);

    });
   
    //upload the rest of images
    var myArray = req.files.images
    var images = []; 
    myArray.forEach(function(value){
      images.push('./assets/images/pictures/' + value.name)
      value.mv('./assets/images/pictures/' + value.name, function(err) {
        
        if (err)
             return res.status(500).send(err);
        });
    });

    // get count 
    var id =   db.get('properties')
         .size()
         .value()
    id = id + 1
    db.get('properties')
      .push({ id: id, name: req.body.name, file: 'assets/images/pictures/' + sampleFile.name , file_list: images,  type: req.body.type, description: req.body.description, location: {address: req.body.address, city: req.body.city} })
      .write()

    // Increment count
    db.update('count', n => n + 1)
      .write()
    if (err){
        return res.status(500).send(err);
    }
     
 
     res.redirect('/admin/properties/manage');


 });



app.post('/sendemail', function(req, res) {

    console.log('body' , req.body);
    console.log('params', req.params)
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'negusmultimedia@gmail.com',
          pass: 'january1'
        }
      });
      
      var mailOptions = {
        from: req.body.email,
        to: 'jodimarietaylor18@gmail.com',
        subject: 'Oran Web - Request for Valuation ' + req.body.subject,
        text: req.body.message
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.redirect('/');

        }
      });
 });
 

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ${port}'));