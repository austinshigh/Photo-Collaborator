var express = require('express');
var router = express.Router();
var multer = require('multer');
const {restart} = require('nodemon');
var photoController = require('../../controllers/photoController');
const PhotoService = photoController.PhotoService;
var upload = multer({
    storage: photoController.storage,
    fileFilter: photoController.imageFilter
});;

router.use((req, res, next) => {
    res.set({
        // Allow AJAX access from any domain
        'Access-Control-Allow-Origin': '*',
        // Allow methods and headers for 'preflight'
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    if (req.method == 'OPTIONS') {
        return res.status(200).end();
    }
    next();
})

// photos - list
router.get('/', (req, res, next) => {
    PhotoService.list()
        .then((photos) => {
            console.log(`API: Found images: ${photos}`);
            res.status(200);
            res.json(photos);
        })
});

// photos/:photoid - find
router.get('/:photoid', (req, res, next) => {
    PhotoService.read(req.params.photoid)
        .then((photo) => {
            console.log(`API: Found image: ${photo}`);
            res.status(200);
            res.json(photo);
        }).catch((err) => {});
})

// /photos POST create
router.post('/', upload.single('image'), async (req, res, next) => {
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

    try {
        const photoSave = await PhotoService.create(photo);
        res.status(201);
        res.json(photoSave);
    } catch (err) {
        console.log(err);
        throw new Error("PhotoSaveError", photo);
    }
});


// /photos/:photoid PUT - update
router.put('/:photoid', (req, res, next) => {
    console.log(`putting ${req.params.photoid}`);
    let putdata = req.body;
    PhotoService.update(req.params.photoid, putdata)
        .then((updatedPhoto) => {
            res.status(200);
            res.json(updatedPhoto);
        }).catch((err) => {
            res.status(404);
            res.end();
        });
});

// /photos/:photoid DELETE - delete
router.delete('/:photoid', (req, res, next) => {
    let id = req.params.photoid;
    PhotoService.delete(req.params.photoid)
        .then((photo) => {
            console.log(`Found image: ${id}`);
            res.status(200);
            res.json(photo);
        }).catch((err) => {
            res.status(404);
            res.end();
        });
});

// export our router
module.exports = router;;