// importa o mongoose
const mongoose = require('mongoose');

// Cria o Schema do mongoose 
const Schema = mongoose.Schema;

// Schema do link, com os campos que quero guardar no banco
const urlSchema = new Schema({
    // Link real que vai ser encurtado
    originalUrl: {
        type: String,
        required: true
    },
    // Codigo unico da URL encurtada
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    // Contador de clicks, comeca em 0
    clicks: {
        type: Number,
        default: 0
    },
    // Data de criacao do link, com valor padrao do momento que for criado
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Cria a collection baseada no Schema
const Url = mongoose.model('Url', urlSchema);

// Exporta pra usar nas rotas
module.exports = Url;