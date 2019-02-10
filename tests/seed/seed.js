const {UserModel} = require('../../models/users');
const {TodoModel} = require('../../models/todos');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

var id1 = new ObjectID();
var id2 = new ObjectID();

const users = [{
    _id : id1,
    email : 'oguzhan123@hotmail.com',
    password : 'userOnePass',
    tokens : [{
        access : 'auth',
        // .sign metodu id den başka bir şeyi kabul etmiyor. hataya sebep oluyor testte
        token : jwt.sign({id:id1 , access:'auth'}, process.env.JWT_SECRET)
        }]
    },
    {
        _id : id2,
        email : 'oguzhan12@hotmail.com',
        password : 'userTwoPass',
        tokens : [{
            access : 'auth',
            // .sign metodu id den başka bir şeyi kabul etmiyor. hataya sebep oluyor testte
            token : jwt.sign({id:id2 , access:'auth'}, process.env.JWT_SECRET)
            }]
    }
]

const todos = [{
    _id : new ObjectID(),
    text : "the first one for test",
    _creator : id1
}
, {
    _id : new ObjectID(),
    text : "the second one for test",
    _creator : id2
}];

const populateUsers = (done) => {
    UserModel.remove().then(()=>{

        var user1 = new UserModel(users[0]).save();
        var user2 = new UserModel(users[1]).save();
        
        return Promise.all([user1,user2])

    }).then(()=>{
        done();
    });
}

const populateTodos = (done) => {
    TodoModel.remove().then(() => {
        return TodoModel.insertMany(todos);

    }).then(()=>{
        done();
    })
}

module.exports = {
    todos, users, populateTodos, populateUsers
}