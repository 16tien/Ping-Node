require('dotenv').config()

const express = require('express');
const configViewEngine = require('./config/viewEngine')
const webRoutes = require('./routes/web')
const app = express();
const port = process.env.PORT || 8888;
const mysql = require('mysql2')
//config template engine
configViewEngine(app)
app.use('/',webRoutes)

//test connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'hoidanit',
    port: 3307,
    password: '123456'
});

connection.query(
    'select * from Users u',
    function(err, results, fields){
        console.log(">>>result: ", results);
        console.log(">>> fields: ",fields);
    }
);

app.listen(port,()=>{
    console.log(`Example app listening on port ${port} and nodemon`)
})
