let express = require('express')
let fileRepository = require('../api/File/repository/repository')
let userRepository = require('../api/User/repository/repository')

module.exports = (app) => {

    var apiRoutes = express.Router()
    apiRoutes.use(function (req, res, next) {
        userRepository.repository().auth(req, res, next)
    })
    app.get('/', (req, res, next) => {
        res.json({ result: 'success', msg: 'Sistema de gerenciamento!',version:'v1'})
    })

    apiRoutes.post('/file/create', (req, res, next) => {
        fileRepository.repository().fileCreate(req.body).then(result => {
            res.send(result)
        }).catch(err => {
            res.send(err)

        })
    })

    app.post('/file/update',(req,res,next)=>{
        
    })
    apiRoutes.post('/file/count', (req, res, next) => {
        fileRepository.repository().fileCount().then(result => {
            res.send(result)
        }).catch(err => {
            res.send(err)

        })
    })

    apiRoutes.post('/user', (req, res, next) => {
        userRepository.repository().inicial().then(result => {
            res.send(result)
        }).catch(err => {
            res.send(err)
        })
    })
    apiRoutes.post('/user/update',(req,res,next)=>{
        userRepository.repository().userUpdate(req.body).then(result=>{
            res.send(result)
        }).catch(err=>{
            res.send(err)
        })
    })
    app.post('/register', (req, res, next) => {
        userRepository.repository().userRegister(req.body).then(result => {
            res.send(result)
        }).catch(err => {
            res.send(err)
        })
    })
    
    app.post('/login', (req, res, next) => {
        userRepository.repository().login(req.body).then(result => {
            res.send(result)
        }).catch(err => {
            res.send(err)
        })
    })
    app.use('/api', apiRoutes)
}
