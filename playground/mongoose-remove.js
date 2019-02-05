const {TodoModel} = require('../models/todos');
const {UserModel} = require('../models/users');


// Herşeyi siliyor. Deprecated
// TodoModel.remove({}).then((doc)=>{
//     console.log(doc);
// });

// findOneAndDelete({}), findByIdAndDelete({})

TodoModel.findOneAndDelete({_id:'5c5853a3574e4a0292c6fc82'}).then((doc)=>{
    console.log(doc);
}, (err)=>{
    console.log(err);
})

// TodoModel.findByIdAndDelete('').then((doc)=>{
//     console.log(doc);
// }, (err)=>{
//     console.log(err);
// })