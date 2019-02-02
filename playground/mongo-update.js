const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (error, client) => {
    if(error){
        return    console.log(error)
    }

    const db = client.db('TodoApp')

    db.collection('Todos').findOneAndUpdate({_id : new ObjectID('5c55851f9da8ac19e6fe34ac')}, 
        {$set : { completed : true} }, {returnOriginal : false}
    ).then((res) => {
        console.log(res)
    })

    db.collection('Users').findOneAndUpdate({name:'oguzhan'}, {$inc : {
        age:1
    }}, {returnOriginal : false}).then(res => {
        console.log(res)
    })
})