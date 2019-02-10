const {mongoose} = require('../db/mongoose.js');

var TodoModelSchema = new mongoose.Schema( {
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
    },
    _creator:{
        type : mongoose.Schema.Types.ObjectId,
        required :true
    }
});

var TodoModel = mongoose.model('TodoModel', TodoModelSchema);

module.exports = {
    TodoModel
};