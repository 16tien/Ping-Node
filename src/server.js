require('dotenv').config()

const express = require('express');
const configViewEngine = require('./config/viewEngine')
const webRoutes = require('./routes/web')
const app = express();
const port = process.env.PORT || 8888;
const connection = require('./config/database')
//config template engine
configViewEngine(app)
app.use('/',webRoutes)


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
