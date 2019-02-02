const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", {useNewUrlParser : true}, (error, client) => {

    if(error){

        return console.log('Unable to connect to database', error)
    }

    const db = client.db('TodoApp')

    // db.collection('Users').deleteMany({name:'oguzhan'}).then((res) => {
        
    //     console.log(res);
    // })

    db.collection('Users').findOneAndDelete({_id : new ObjectID("5c558a300fb13919f9657b01")}).then((res) => {
        console.log(res)
    })

    client.close()
})