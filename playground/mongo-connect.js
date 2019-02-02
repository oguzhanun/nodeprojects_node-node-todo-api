// öncelikle mongodb/bin klasörüne terminalden ulaşıp mongo-data adresi üzerinde
// veritabanını boot ediyoruz...
// ./mongod --dbpath ~/mongo-data
// komutu ile... sonrasında buradan devam edebiliriz...

//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var id = new ObjectID();
console.log(id.getTimestamp());

// ikinci argümanı mongodb istiyor. yeni url parser ına geçeceklermiş...
MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser : true}, (error, client) => {

    if(error){
        return console.log("Unable to connect to database...")
    }
    console.log("happy connections...")

    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //    text : "Something to do",
    //    completed : false 
    // }, (error, result) => {
    //     if(error){
    //         console.log('Unable to insert... ', error);
    //     }
    //     else{
    //         console.log(JSON.stringify(result.ops, undefined, 10))
    //     }
    // })

    // db.collection('Users').insertOne({
        
    //     //_id : 123, // Bu şekilde kendimiz bir ID verebiliriz.....
    //     // ID üzerindeki timestamp i almak için ise " result.ops[0]._id.getTimeStamp() kodunu çalıştırmamız lazım....
    //     // yukarıdaki kodda [0] ile son yazılan document elde edilir...
    //     name : 'oğuzhan',
    //     age : 34,
    //     location : 'samsun'
    // }, (error, result) => {
    //     if(error){
    //         console.log('Unable to insert ...', error);
    //     } else {
    //         console.log(JSON.stringify(result.ops[0], undefined, 10))
    //     }
    // })

    client.close();
})