const mongoose = require('mongoose')

var TodoModel = mongoose.model('Todos', {
    text : {
        type : String,
        required : true,
        trim : true,
        minlength : 1
    },
    completed : {
        type : Boolean,
        default : false
    },
    completedAt : {
        type : Number,
        default : null
    }
})

module.exports = {
    TodoModel
}