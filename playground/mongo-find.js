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

    // tüm document lar elde edilip yazdırılıyor... find methodu ile bir cursor elde ediyoruz. sonrasında toArray ile
    // document leri bir promise olarak geri alıyoruz. Burada client.close metodunu promise dışına yazmanın sakıncaları var
    // bir nevi çakışmaya sebep oluyor...

    // db.collection('Todos').find().toArray().then((docs) => {
    //     console.log("Todos : ")
    //     console.log(JSON.stringify(docs, undefined, 10))
    //     client.close()
    // }, (error) => {
    //     console.log("Unable to fetch the data...", error)
    // })

    // false olan completed ların olduğu document döndürülüyor.

    // db.collection('Todos').find({completed : false}).toArray().then((docs) => {
    //     console.log("Todos : ")
    //     console.log(JSON.stringify(docs, undefined, 10))
    //     client.close()
    // }, (error) => {
    //     console.log("Unable to fetch the data...", error)
    // })

    // _id ile arama yapılacak ise _id objesinin değeri de bir başka obje o da new ObjectID ile inşa edilip arama yaptırılmak zorunda...
    // db.collection('Todos').find({
    //     _id : new ObjectID('5c55851f9da8ac19e6fe34ac')
    // }).toArray().then((docs) => {
    //     console.log("Todos : ")
    //     console.log(JSON.stringify(docs, undefined, 10))
    //     client.close()
    // }, (error) => {
    //     console.log("Unable to fetch the data...", error)
    // })

    db.collection('Users').find({name:'oguzhan'}).toArray().then((docs) => {
        console.log('Users : ')
        console.log(JSON.stringify(docs, undefined, 10))
        client.close()
    }, (error) => {
        console.log("Unable to fetch the data...", error)
    })
})