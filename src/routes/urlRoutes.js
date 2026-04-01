const express = require('express'); // Importa o express
const router = express.Router(); // Cria um router do express
const controller = require('../controllers/urlController'); // Importa o controller 


// ROTA PRA CRIAR O LINK ENCURTADO  
router.post('/shorten', controller.shortenController);

// ROTA PRA RENDERIZAR A PAGINA INICIAL COM O FORMULARIO
router.get('/', controller.startController);

// ROTA PARA REDIRECIONAR E CONTAR CLIQUE 
router.get('/:shortId', controller.redirectController);


// Exporta pra usar nas rotas
module.exports = router;