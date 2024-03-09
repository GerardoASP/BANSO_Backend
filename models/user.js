const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    country: { type: String, require: true },
    department: { type: String},
    municipality: { type: String},
    document_type: { type: String, require: true },
    document: { type: String, require: true, unique: true},
    active: { type: Boolean, require: true, default: false },
    avatar: { type: String},
    email: { type: String, require: true, unique: true},
    password: { type: String, require: true },
    rol: { type: String, default:"user"},
    userProjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project'
    }]
})

module.exports = mongoose.model("User", userSchema);