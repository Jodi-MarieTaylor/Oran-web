var express  = require("express"),
    app  = express();
const router = express.Router();
const fileUpload = require('express-fileupload');

// default options

router.get('/property/create', (req, res, next) => {
   
    var root = process.cwd();
    
    res.sendFile(root + "/site/templates/admin.html")

});




  

  /*router.post('/upload/picture', function(req, res) {
    console.log('re', req);
    //console.log(req.files.foo); // the uploaded file object
    //var id = storage.insert(req.files.foo.name, fs.createReadStream('/assets/pictures/'+ req.files.foo.name));
    //console.log(id);
  });*/
module.exports = router;