//console.log("App;");// npm run server
const express = require('express');// подключаем express
const config = require('config');// подключаем config
const path = require('path');
const mongoose = require('mongoose');// подключаем mongoose

const app = express(); //наш сервер
app.use(express.json({extended:true}));//приводим body к формату json
app.use('/api/auth', require('./routes/auth.routes'));//подключаем auth.routes
app.use('/api/link', require('./routes/link.routes'));//подключаем link.routes
app.use('/t', require('./routes/redirect.routes'));//подключаем redirect.routes

//чтоб одновременно работал frontend and backend
if(process.env.NODE_ENV === 'production'){
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));

    app.get('*',(request, response) => {
        response.sendFile(path.resolve(__dirname,'client', 'build','index.html'))
    })
}


const PORT = config.get('port') || 5000;// получаем  переменную 'port' из файла default.json
const start = async()=> {
    try {
       await mongoose.connect(config.get('mongoUri'),{
           //эти параметры нужны для успешной работы connect
           useNewUrlParser: true,
           useUnifiedTopology:true,
           useCreateIndex:true
       });
        app.listen(PORT, ()=> console.log(`app has been create on port ${PORT}`));
    }catch(e){
        console.log('server error', e.message);
        process.exit(1)//останавливаем процесс при возникновении ошибке
    }
};
start();
