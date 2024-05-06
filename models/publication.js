const mongoose = require('mongoose')
const publicationSchema=mongoose.Schema({
    title: { type: String, required: true},
    active: { type: Boolean, default: true },
    description: {type: String, required: true},
    datePublication: { type: Date, require: true,default:Date.now()},
    author:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users" 
    },
    observations:{type: String},
    contact:{type:String}
});
  
module.exports = mongoose.model('Publication', publicationSchema);