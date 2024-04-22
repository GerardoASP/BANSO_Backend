const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    department: { type: String},
    municipality: { type: String},
    document_type: { type: String },
    document: { type: String},
    active: { type: Boolean, require: true, default: false },
    avatar: { type: String},
    email: { type: String, require: true, unique: true},
    password: { type: String, require: true },
    rol: { type: String, default:"user"},
    user_career: { type: String},
    userProjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    userPublications:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Publication'
    }],
    verifyCode: String,
})

module.exports = mongoose.model("User", userSchema);