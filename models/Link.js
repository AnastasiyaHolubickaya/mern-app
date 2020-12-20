const {Schema, model, Types} = require('mongoose');//достаем  из mongoose поле Schema и функцию model

const schema = new Schema({
    // поле -  тип строка, обязательное, уникальное
    from:{type:String, required:true},
    to:{type: String, required: true,unique:true},
    code:{type: String, required: true,unique:true},
    data: {type: Date, default: Date.now},
    click: {type: Number, default: 0},
    owner: {type: Types.ObjectId, ref:'User'}
});// создаем schema через конструктор классов


module.exports = model('Link', schema);// експортируем функцию model