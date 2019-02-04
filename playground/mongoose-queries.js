const {ObjectID} = require('mongodb');

const {TodoModel} = require('../models/todos');
const {UserModel} = require('../models/users');

const id = '5c582c4b34227606f9c1725d';

if(!ObjectID.isValid(id)){
    console.log("Object Id is not valid!!!")
}

TodoModel.find({
    _id : id
}).then((todos) => {
    console.log(todos);
});

TodoModel.findOne({
    _id : id
}).then((todo) => {
    console.log(todo);
});

TodoModel.findById(id).then((todo)=>{
    if(!todo){
        return console.log('There is no todo');
    }
    console.log(todo);
}).catch((e)=>{console.log(e)})