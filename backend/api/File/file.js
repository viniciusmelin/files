let mongoose = require('mongoose')
let schema = mongoose.Schema
const fileSchema = new mongoose.Schema({
    text:{type:String, unique:[true,'{PATH} is unique!'], required:[true,'{PATH} is required!']},
    colum:{type:String, required:[true,'{PATH} is required!']},
    called:[{type:Number, required:[true,'{PATH} is required!']}],
    user: {type: schema.Types.ObjectId,ref:'User',required:[true,'{PATH} is required!']}
})

module.exports = mongoose.model('File',fileSchema)