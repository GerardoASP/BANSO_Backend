const mongoose = require('mongoose')
const projectSchema = mongoose.Schema({
    nameProject: { type: String, require: true },
    stateProject: { type: String, require: true },
    dateStart: { type: String, require: true },
    descriptionProject: { type: String},
    projectUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    projectSubjects:{type:[String]}
})

module.exports = mongoose.model("Project", projectSchema);