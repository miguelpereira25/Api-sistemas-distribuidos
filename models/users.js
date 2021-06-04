const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    nome: {type: String,
    required: true},
    sobrenome: {
        type:String,
        required:true},
});
module.exports = mongoose.model('aluno',userSchema)
