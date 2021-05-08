var express = require('express');
var router = express.Router();
var multer = require("multer");
var photoController = require('../controllers/photoController');
var upload = multer({
    storage: photoController.storage,
    fileFilter: photoController.imageFilter
});
var flash = require('express-flash');
var Photo = require('../models/photoModel');
var PhotoService = photoController.PhotoService;

// flash messaging
router.use(flash());

/* Get homepage. */
router.get('/', function(req, res, next) {
    // access db, find all photos, pass to index.pug
    PhotoService.list()
        .then((photos) => {
            res.render('index', {
                title: 'Photo Book',
                photos: photos
            });
        })
        .catch((err) => {
            if (err) {
                res.end("ERROR!")
            }
        });
});

/* Get new photo page */
router.get('/newPhoto', function(req, res, next) {
    // pass site title and flash into new photo page
    res.render('newPhoto', {
        title: 'Photo Book',
        flashMsg: req.flash("fileUploadError")
    });
});

/* update photo page */
router.get('/photos/:photoid', (req, res, next) => {
    // find photo by id
    PhotoService.read({
            '_id': req.params.photoid
        })
        .then((photo) => {
            // pass proper values and photo to update photo page
            res.render('updatePhoto', {
                title: "Photo Book",
                photo: photo,
                flashMsg: req.flash("photoFindError")
            })
        });
});

/* Recieve form content and update existing document in db */
router.post('/photos/:photoid', (req, res, next) => {
    PhotoService.read({
            '_id': req.params.photoid
        })
        .then(() => {
            // create data item with form data
            var data = {
                title: req.body.title,
                description: req.body.description
            }
            // update document in db and save changes
            PhotoService.update(req.params.photoid, data)
                .then(() => {
                    res.redirect('/');
                });
        });
});

/* Perform delete of document from db */
router.post('/photos/del/:photoid', (req, res, next) => {
    // delete photo by id
    PhotoService.delete({
            '_id': req.params.photoid
        })
        .then(() => {
            // redirect to id
            res.redirect('/');
        });
});

/* Get form content, add photo and redirect to home page */
router.post('/add-photo', upload.single('image'), (req, res, next) => {
    // set filepath for image
    var path = "/img/" + req.file.filename;
    // create photo object with form data
    var photo = {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        imageurl: path,
        title: req.body.title,
        filename: req.file.filename,
        description: req.body.description,
        size: req.file.size / 1024 | 0
    }
    // create and save document in db
    PhotoService.create(photo)
        .then(() => {
            // redirect to home page
            res.redirect('/');
        }).catch((err) => {
            if (err) {
                console.log(err);
                throw new Error("PhotoSaveError", photo);
            }
        });
});

// Create flash error functionality
router.use(function(err, req, res, next) {
    console.error(err.stack);
    // handle incorrect image type errors
    if (err.message == "OnlyImageFilesAllowed") {
        req.flash('fileUploadError', "Please select an image file with a jpg, png, or gif file extension.")
        res.redirect('/newPhoto');
        // handle photo save errors
    } else if (err.message == "PhotoSaveError") {
        req.flash('photoSaveError', "There was a problem saving your image file.");
        res.redirect('/');
    } else {
        next(err);
    }
});

module.exports = router;