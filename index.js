const contenedor = require('./contenedor.js');
const express = require('express');
const { Router } = express;

const products = new contenedor("./products.json");

const app = express();
const router = Router();

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/api/productos'))

router.get('/', async(req, res) => {
    const aProducts = await products.getAll();
    let productsCards = ``;

    aProducts.map( item => ( 
        productsCards += `<div><h2>${item.title}</h2><p>$${item.price}</p><img height='200px' src='${item.thumbnail}' alt='${item.title}' /></div>`
    ));

    res.send(`<h1>LOMPAS Indumentaria</h1> ${productsCards}`);
});

router.get('/:id', async(req, res) => {
    const productId = parseInt(req.params.id);
    const aProduct = await products.getById(productId);

    res.json(aProduct);
    //res.send(`<h1>${aProduct.title}</h1> <p>$${aProduct.price}</p> <img height='200px' src='${aProduct.thumbnail}' alt='${aProduct.title}' />`);
});

router.post('/', (req, res) => {
    const product = req.body;
    products.save(product);

    res.json(product);
});

router.put('/:id', async(req, res) => {
    const productId = parseInt(req.params.id);
    const newData = req.body;
    
    await products.modifyById(productId, newData);
    res.send("ok");
});

router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    products.deleteById(productId);

    res.send('ok');
});

app.use('/api/productos', router);

const serv = app.listen(PORT, () => { console.log(`Servidor HTTP escuchando el puerto ${serv.address().port}`); });
serv.on('error', error => console.log(`Error en el servidor: ${error}`));

//products.save({ title: "Test", price: 175, thumbnail: "" });
//products.getById(2);
//products.getAll();
//products.deleteById(4);
//products.deleteAll();