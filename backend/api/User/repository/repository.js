const User = require('../../User/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Auth = require('../Auth')

const repository = () => {
    const inicial = () => {
        return new Promise((resolve, reject) => {
            User.find({}, { password: 0 }, (err, res) => {
                if (err) {
                    reject({ result: 'error', msg: err })
                }

                resolve({ result: 'success', msg: 'User found!', users: res })
            })
        })
    }

    const userRegister = (body) => new Promise((resolve, reject) => {
        //Mínimo de oito caracteres e maximo 12, pelo menos uma letra e um número:
        var re = new RegExp('/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$')
        // console.log(!re.test(body.password))
        // if(!re.test(body.password))
        // {
        //     reject({result:'error',error:{msg:'senha não atende os requisitos minimos!'}})
        // }
        var hashedPassword = bcrypt.hashSync(body.password, 8)
        User.create({
            name: body.name,
            email: body.email,
            password: hashedPassword,
            active: true
        }, (err, user) => {
            if (err) {
                if (err.code === 11000) {
                    reject({ result: 'error', error: { msg: 'O email informado já foi cadastrado!' } })
                }
                reject({ result: 'error', error: err })
            }

            var token = jwt.sign({ id: user._id }, Auth.secret, {
                expiresIn: 86400
            })

            resolve({ result: 'success', msg: 'User create success!', token: token })
        })

    })


    const userUpdate = (body) => new Promise((resolve, reject) => {
        const nome = body.name
        const passwordold = body.passwordold
        const passwordnew = body.passwordnew
        const emailold = body.emailold
        const emailnew = body.emailnew
        const active = body.active

        if (!passwordold) {
            return reject({ result: 'error', error: { msg: 'Old password is required!' } })
        }
        if (!passwordnew) {
            return reject({ result: 'error', error: { msg: 'New password is required!' } })
        }
        if (!nome) {
            return reject({ result: 'error', error: { msg: 'Nome is required!' } })
        }
        if (!emailnew) {
            return reject({ result: 'error', error: { msg: 'New email is required!' } })
        }
        if (!emailold) {
            return reject({ result: 'error', error: { msg: 'Old email is required!' } })
        }
        User.findOne({ email: emailold }, (err, user) => {
            if (err) {
                return reject({ result: 'error', error: err })
            }
            if (user == null) {

                return reject({ result: 'error', error: { msg: 'Old email not exists!' } })
            }

            var passwordIsValid = bcrypt.compareSync(passwordold, user.password)

            if (!passwordIsValid) {
                return reject({ result: 'error', error: { msg: 'Email or password invalid' } })
            }

            User.findOne({ email: emailnew }, (err, usernew) => {
                if (err) {

                    return reject({ result: 'error', error: err })
                }
                if (usernew) {
                    return resolve({ result: 'error', msg: 'Email already registered!' })
                }
                const hashedPassword = bcrypt.hashSync(passwordnew, 8)

                User.updateOne({ _id: user._id }, { name: nome, email: emailnew, password: hashedPassword, active: active }, (err, userUpdate) => {

                    if (err) {

                        return resolve({ result: 'error', error: err })
                    }

                    return resolve({ result: 'success', msg: 'User update success!', user: userUpdate })
                })
            })
        })
    })
    const login = (body) => new Promise((resolve, reject) => {

        User.findOne({ email: body.email }, (err, user) => {
            if (err) {
                return reject({ result: 'error', error: err })
            }
            if (user == null) {
                return reject({ result: 'error', error: { msg: 'Not found Account!' } })
            }
            if (!body.password) {
                return reject({ result: 'error', error: { msg: 'Password is required!' } })
            }
            var passwordIsValid = bcrypt.compareSync(body.password, user.password)

            if (!passwordIsValid) {
                return reject({ result: 'error', error: { msg: 'Authetication failed!' } })
            }

            var token = jwt.sign({ id: user._id }, Auth.secret, {
                expiresIn: 86400
            })

            return resolve({ result: 'success', msg: 'User authentication!', token: token })
        })

    })

    const auth = (req, res, next) => {
        const token = req.body.token
        if (!token) {
            res.send({ result: 'error', error: { msg: 'No token provided.' } })
            return
        }

        jwt.verify(token, Auth.secret, (err, decode) => {
            if (err) {
                res.send({ result: 'error', error: { msg: 'Failed to authenticate token.' } })
                return
            }

            User.findById(decode.id, { password: 0 }, (err, user) => {

                if (err) {
                    res.send({ result: 'error', error: { msg: 'User not found!' } })
                }
                next(user)
            })
        })
    }

    return Object.create({
        inicial,
        userRegister,
        auth,
        login,
        userUpdate
    })
}

module.exports = Object.assign({ repository })