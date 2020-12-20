const {Router} = require('express');// импортируем Router
const bcrypt = require('bcryptjs');//подключаем библиотеку для шифрования паролей (позволяеь хешировать пароли и сравнивать)
const config = require('config');// подключаем config
const jwt = require('jsonwebtoken');//подключаем модуль для авторизации пользователя (для SPA)
const {check, validationResult} = require('express-validator');// импортируем  метод check и функцию validationResult
const User = require('../models/User'); // подключаем модель Users
const router = Router();//  присваиваем переменной

// создаем endpoint
// конкатенируется с уже имеющимся путем - /api/auth/register
router.post('/register',
    //делаем валидацию полей формы
    [
        check('email', 'некорректный email').isEmail(),
        check('password', 'минимальная длина пароля 6 символов').isLength({min:6}),
    ],
    async (request, response)=>{
        try {
            console.log('body',request.body);
            const error = validationResult(request);//ловим ошибки валидации
            // если ошибки есть возвращаем на frontend статус 400 (останавливаем дальнейшее выполнение скрипта)
            if (!error.isEmpty()){
                return   response.status(400).json({
                    error: error.array(),
                    message: 'некорректные данные при регистрации'});
            }
            const {email, password} = request.body;// получаем данные из запроса на регистрацию (отправляются из frontend)

            //проверяем существует ли пользователь с аким email
            const candidate = await  User.findOne({email: email});

            //если что-то есть в candidate
            if (candidate){
              return   response.status(400).json({message: 'пользователь с таким email уже существует'});
            }

            //первую проверку прошли - регистрируем нового пользователя
            const hashedPassword = await bcrypt.hash(password, 12);//хешируем пароль
            const user = new User({email, password: hashedPassword});//создаем нового пользователя
            await user.save();// ждем когда он сохранится

            //отправляем ответ с кодом 201 - пользователь создан
            response.status(201).json({message: 'пользователь создан'})

        } catch (e) {
            response.status(500).json({message: 'что-то пошло не так'})//  обработка общей ошибки сервера
        }

});
///api/auth/login
router.post('/login',
    [
        check('email', 'введите корректный email').normalizeEmail().isEmail(),// метод normalizeEmail() приводит емаил в корректный вид
        check('password', 'введите пароль').exists()// exists()- пароль должен существовать
    ],
    async (request, response)=>{
    try {
        const error = validationResult(request);//ловим ошибки валидации
        // если ошибки есть возвращаем на frontend статус 400 (останавливаем дальнейшее выполнение скрипта)
        if (!error.isEmpty()){
            return   response.status(400).json({
                error: error.array(),
                message: 'некорректные данные при входе в систему'});
        }
        const {email, password} = request.body;
        const user = await  User.findOne({email: email});//ищем пользователя в базе данных

        if(!user){
            return   response.status(400).json({message: 'пользователz с таким email не существует'});
        }
        //проверку прошли пользователь найден, проверяем совпадение паролей
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return   response.status(400).json({message: 'неверный пароль'});
        }
        //авторизация потзователя
        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '2h'}
        );
        response.json({token, userId:user.id});
    } catch (e) {
        response.status(500).json({message: 'что-то пошло не так'})//  обработка общей ошибки сервера
    }
});


module.exports = router; // экспортируем