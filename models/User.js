const {Schema, model, Types} = require('mongoose');//достаем  из mongoose поле Schema и функцию model

// создаем schema через конструктор классов
const schema = new Schema({
    // поле -  тип строка, обязательное, уникальное
    email:{type:String, required:true, unique:true},
    password:{type: String, required: true},
    links:[{type: Types.ObjectId, ref:'Link'}]
});


module.exports = model('User', schema);// експортируем результат работы функции model