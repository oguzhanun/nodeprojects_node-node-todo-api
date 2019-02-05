const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// mLAB ten database kullanıcı adı ve parolası almadığımdan database çalışmıyordu. Şu an düzeldi... böyle bir durumda
// UnhandledPromiseRejectionWarning ve Authentication failure hatası veriyor...
// || "mongodb://localhost:27017/TodoApp" bu kısma artık gerek yok. verinin tamamı developement veya test durumuna göre
// tek bir noktadan belirleniyor...
mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true });
// .then(()=>{
//     console.log("Connected to Database...")   
// });

module.exports = {mongoose};