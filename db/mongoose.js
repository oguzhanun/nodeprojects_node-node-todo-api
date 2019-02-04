const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// mLAB ten database kullanıcı adı ve parolası almadığımdan database çalışmıyordu. Şu an düzeldi... böyle bir durumda
// UnhandledPromiseRejectionWarning ve Authentication failure hatası veriyor...
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost:27017/TodoApp",{ useNewUrlParser: true });
// .then(()=>{
//     console.log("Connected to Database...")   
// });

module.exports = {mongoose};