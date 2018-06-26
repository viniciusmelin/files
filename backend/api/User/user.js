let mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {type: String, required:[true,'{PATH} is required!']},
    email: {type: String,unique:true, required:[true,'{PATH} is required!']},
    password: {type: String,min:6,max:12, required:[true,'{PATH} is required!']},
    active:{type:Boolean,default:true, required:[true,'{PATH is required!}']}
})

module.exports = mongoose.model('User',userSchema)