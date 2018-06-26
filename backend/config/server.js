

let express = require('express')
let bodyParse = require('body-parser')
let cors = require('cors')
let queryParser = require('express-query-int')
let _ = require('lodash')
let cookieParser = require('cookie-parser')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)

module.exports = (db) =>{
    const app = express()
    app.use(cookieParser())
    app.use(session({
        secret:'my-secret',
        resave:false,
        saveUninitialized: true,
        store: new MongoStore({dbPromise:db})
    }))
    app.use(bodyParse.urlencoded({extended:true}))
    app.use(bodyParse.json())
    app.use(cors())
    app.use(queryParser())
    
    app.listen(8000,()=>{
        console.log('BACKEND ON')
    })

    return Object.create(app)
}