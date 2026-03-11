/* Importa o model do banco, a lib pra gerar ID aleatorio, o express e a lib pra validar URL */
const Url = require('../models/Url');
const shortid = require('shortid');
const express = require('express');
const router = express.Router();
const validUrl = require('valid-url');


// ROTA PRA CRIAR O LINK ENCURTADO  

router.post('/shorten', async (req, res) => {
    //Pega o link que veio no body da req
    const {url, customUrl} = req.body;
    
    try {
        // Valida se o que chegou for realmente um link
        if (!validUrl.isUri(url)) {
            return res.render('index', {
                linkGerado: null,
                error: 'URL inválida!'
            }); // aqui a gente renderiza a view e passa o erro pra ela mostrar pro user
        }
        
        let shortUrl;

        // Se o user enviou uma url personalizada, verifica se ele já existe no banco
        if (customUrl) {
            const customUrlExists = await Url.findOne({ shortId: customUrl });

            if (customUrlExists) {
                return res.render('index', {
                    linkGerado: null,
                    error: ' Está URL já está em uso. Por favor escolha outra.'
                });
            }
            
            // Se a URL personalizada for válida e não existir, cria o link com ela
            shortUrl = customUrl;
            
            const newUrl = new Url({
                originalUrl: url,
                shortId: shortUrl
            });

            await newUrl.save(); 
            
            return res.render('index', {
                linkGerado: `https://gr-u.onrender.com/${shortUrl}`,
                error: null
            }); // aqui a gente renderiza a view e passa o link curto pra ela mostrar pro user 
        }

        // Verifica se a URL já existe no banco, para n criar outra igual
        const urlExists = await Url.findOne({ originalUrl: url });

        //se existir nao cria uma nova e devolve a que ja tem
        if (urlExists) {
            return res.render('index', {
                linkGerado: `https://gr-u.onrender.com/${urlExists.shortId}`,
                error: 'Este link já foi encurtado'
            }); // aqui a gente renderiza a view e passa o link curto pra ela mostrar pro user
        }

        // Gera o ID aleatorio pro encurtador
        shortUrl = shortid.generate();

        // Prepara o objeto com o model do db
        const newUrl = new Url({
            originalUrl: url,
            shortId: shortUrl 
        });

        // Salva no banco e avisa se funcionou ou n
        await newUrl.save(); // usamos o await pq é uma funcao assincrona, entao ele espera salvar pra depois mandar a resposta
        
        res.render('index', {
            linkGerado: `https://gr-u.onrender.com/${shortUrl}`,
            error: null
        }); // aqui a gente renderiza a view e passa o link curto pra ela mostrar pro user

    } catch (err) {
        // se der erro, mostra no console e avisa o user
        console.error(err);
        res.render('index', {
            linkGerado: null,
            error: 'Ops, algo deu errado. Tente novamente.'
        }); // exibe a view com a mensagem de erro
    }
});

// ROTA PRA RENDERIZAR A PAGINA INICIAL COM O FORMULARIO

router.get('/', (req, res) => {
    res.render('index', { // aqui a gente renderiza a view e passa o link curto e o erro como null, pq nessa rota a gente so quer mostrar o form vazio, sem link ou erro
        linkGerado: null,
        error: null
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