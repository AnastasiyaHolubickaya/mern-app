//  переход по сокращенной  ссылке типа link: http://localhost:5000/t/m4DHTekoV

const {Router} = require('express');// импортируем express, достаем из него Router
const Link = require('../models/Link'); // подключаем модель Users
const router = Router();//  создаем router



router.get('/:code',
    async (request, response)=>{
        try {
            //получаем текущую ссылку ( с которой работаем )
            const link = await Link.findOne ({code: request.params.code});
        if(link){
            link.click ++;//считаем клики
            await link.save();//сохраняем ссылку
            return  response.redirect(link.from)//редирект по ссылке link.from
        }
            response.status(404).json({message: 'ссылка не найдена'})

        } catch (e) {
            response.status(500).json({message: 'что-то пошло не так'})//  обработка общей ошибки сервера
        }
    });


module.exports = router; // экспортируем