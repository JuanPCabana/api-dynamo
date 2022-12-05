const multer = require('multer')

const storage = multer.diskStorage({
    destination: './public/files/',
    filename: function (req, file, cb) {

        var  extension = file.originalname.slice(file.originalname.lastIndexOf('.'))
        
      cb(null, Date.now()+extension )
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload