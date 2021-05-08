var mongoose = require("mongoose");

// Get access to mongoose constructor
var Schema = mongoose.Schema;

// Create a new schema
const schema = new Schema({
  originalname: {type: String, required:true},
  mimetype: {type: String, required:true},
  filename: {type: String, required:true},
  imageurl: {type: String, required:true},
  description: {type: String, required:false},
  title: {type: String, required:false},
  size: {type: String, required:true},
  createdAt: {type: Date},
  updatedAt: {type: Date}
});

schema.pre('save', function(next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    } else {
        this.updatedAt = new Date();
    }
    next();
});

//export model with associated name and schema
module.exports = mongoose.model("Photo", schema);
