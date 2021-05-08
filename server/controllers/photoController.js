var multer = require("multer");
var Photo = require('../models/photoModel');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/img');
    },
    filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
    }
    });

// define our fileFilter
const imageFilter = function (req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('OnlyImageFilesAllowed'), false);
    }
cb(null, true);
};

class PhotoService{

    // list
    static list(){
        return Photo.find({})
            .then((photos)=>{
                return photos;
        });
    }

    // read
    static read(id){
        return Photo.findById(id)
            .then((photo)=>{
                // found
                return photo;
            });
    }

    // create
    static create(obj){
       var photo = new Photo(obj);
           return photo.save();
    }

    // update
    static update(id, data){
        return Photo.findById(id)
            .then((photo)=>{
                photo.set(data);
                photo.save();
            return photo;
        });
    }

    // delete
    static delete(id){
        return Photo.deleteOne({_id: id})
            .then((obj)=>{
                return obj;
        })
    }

}

// use it in the multer config
var upload = multer({
fileFilter: imageFilter
});

module.exports.storage = storage;
module.exports.imageFilter = imageFilter;
module.exports.PhotoService = PhotoService;