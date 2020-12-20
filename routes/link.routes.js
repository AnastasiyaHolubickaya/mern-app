const {Router} = require('express');// импортируем express, достаем из него Router
const Link = require('../models/Link'); // подключаем модель Users
const auth = require('../middleWeare/auth.middleware');
const config = require('config');
const shortId = require('shortid');
const router = Router();//  создаем router


// создаем endpoint  для ссылок

// генерация ссылок
router.post('/create', auth,
    async (request, response)=>{
        try {
            const baseUrl = config.get('baseUrl');
            const{from} = request.body;//из тела запроса брем параметр from
            const code = shortId.generate();// генерируем параметр code
            const existing = await  Link.findOne({from});// проверяем есть ли в бд такой from
            if(existing){
                return response.json({link:existing})//если есть отправляем найденную ссылку
            }
            //формируем ссылку
            const  to = baseUrl + '/t/' + code;
            const link = new Link({
                code, to, from, owner: request.user.userId
            });
            await link.save();
            response.status(201).json({link})

        } catch (e) {
            response.status(500).json({message: 'что-то пошло не так'})//  обработка общей ошибки сервера
        }
    });

// получение всех ссылок
router.get('/',auth,
    async (request, response)=>{
        try {
            const links = await  Link.find({owner: request.user.userId});
            response.json(links);
        } catch (e) {
            response.status(500).json({message: 'что-то пошло не так'})//  обработка общей ошибки сервера
        }
    });

// получение ссылки по id
router.get('/:id',auth,

    async (request, response)=>{
        try {
            const link = await  Link.findById(request.params.id);
            response.json(link);
        } catch (e) {
            response.status(500).json({message: 'что-то пошло не так'})//  обработка общей ошибки сервера
        }
    });

module.exports = router; // экспортируем