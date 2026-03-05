/* Importa o model do banco, a lib pra gerar
 ID aleatorio, o express e a lib pra validar URL */
const Url = require('../models/Url');
const shortid = require('shortid');
const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');


// ROTA PRA CRIAR O LINK ENCURTADO  

router.post('/shorten', (req, res) => {
    //Pega o link que veio no body da req
    const url = req.body.url;

    // Valida se o que chegou for realmente um link
    if (!validUrl.isUri(url)) {
        res.send('URL inválida!');
        return; // Para a execucao aqui se não funcionar
    };

    //  Gera o ID aleatorio pro encurtador
    const shortUrl = shortid.generate();

    // Prepara o objeto com o model do db
    const newUrl = new Url({
        originalUrl: url,
        shortId: shortUrl
    });

    // Salva no banco e avisa se funcionou ou n
    newUrl.save().then(() => {
        res.send('URL encurtada com sucesso!');
    }).catch((err) => {
        res.send('Erro ao encurtar URL!');
    });
});

// ROTA PARA REDIRECIONAR E CONTAR CLIQUE 

router.get('/:shortId', async (req, res) => {
    //Pega o ID que veio na URL do navegador
    const shortId = req.params.shortId;

    // Acha o link, soma +1 no click e traz o dado atualizado
    const foundUrl = await Url.findOneAndUpdate(
        { shortId: shortId }, 
        { $inc: { clicks: 1 } }, 
        { new: true }
    );

    // Se achou no db, redireciona. Senao, avisa o user
    if (foundUrl) {
        return res.redirect(foundUrl.originalUrl);
    } else {
        return res.send('URL não encontrada!');
    }
});
// Exporta pra usar nas rotas
module.exports = router;