//console.log("App;");// npm run server
const express = require('express');// подключаем express
const config = require('config');// подключаем config
const path = require('path');
const mongoose = require('mongoose');// подключаем mongoose
//const port = process.env.PORT || 8080;
const app = express(); //наш сервер

//регистрируем routs ( endpoints)
app.use(express.json({extended:true}));//для того, чтоб node корректно отображал  body
app.use('/api/auth', require('./routes/auth.routes'));//подключаем auth.routes (регистрация и авторизация)
app.use('/api/link', require('./routes/link.routes'));//подключаем link.routes
app.use('/t', require('./routes/redirect.routes'));//подключаем redirect.routes

//чтоб  backend запускал  и frontend (node.js отвечает за обновременную работу front and back)
if(process.env.NODE_ENV === 'production'){
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));
    // на любые другие запросы отправляем файл index.html
    app.get('*',(request, response) => {
        response.sendFile(path.resolve(__dirname,'client', 'build','index.html'))
    })
}


const PORT = config.get('port') || 5000;// получаем  переменную 'port' из файла default.json
const start = async()=> {
    try {
        //подсоединяемся к базе данных
       await mongoose.connect(config.get('mongoUri'),{
           //эти параметры нужны для успешной работы connect
           useNewUrlParser: true,
           useUnifiedTopology:true,
           useCreateIndex:true
       });
       // запускаем сервер
        app.listen((process.env.PORT || PORT), ()=> console.log(`app has been create on port ${PORT}`));
    }catch(e){
        console.log('server error', e.message);
        process.exit(1)//останавливаем процесс при возникновении ошибке
    }
};
start();
