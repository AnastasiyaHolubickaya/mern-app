const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (request, response,next) =>{
    if(request.method === "OPTIONS"){// если пришел запрос OPTIONS
        return next()// ничего не делаем продолжаем выполнение запроса
    }
    try {
      const token = request.headers.authorization.split(' ')[1];//у headers есть поле authorization - это строка, с помощью метода split(' '[1]) по пробелу берем 1 элемн
          //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmQ1NTg3NDA5MTk3YjA1YWNmZTM1NjMiLCJpYXQiOjE2MDgxMjY5MzAsImV4cCI6MTYwODEzMDUzMH0.YDgXhEUWX_6PctQ_lRaeyjCHR6ki3MKZtAu9uUagPO4"
        if(!token){
          return   response.status(401).json({message:'нет авторизации'})
        }
        //раскодирываем token
        const decoder = jwt.verify(token,config.get('jwtSecret'));
       request.user = decoder;
       next();
    } catch (e) {
        console.log(e.message);
        return   response.status(401).json({message: 'file auth.middleeware'})
    }
};