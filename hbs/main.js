const contenedor = require('./contenedor.js');
const express = require('express');
const { Router } = express;
const handlebars = require('express-handlebars');

const products = new contenedor("./products.json");

const app = express();
const router = Router();

const PORT = 8080;

app.engine(
    "hbs",
    handlebars.engine({
        extname: "hbs",
        defaultLayout: "productos.hbs",
        layoutsDir: __dirname + "/views"
    })
);

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'))

router.get('/', async(req, res) => {
    const aProducts = await products.getAll();

    res.render('main', {
        aProducts: aProducts 
    });
});

router.get('/:id', async(req, res) => {
    const productId = parseInt(req.params.id);
    const aProduct = await products.getById(productId);

    res.json(aProduct);
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

app.use('/productos', router);

const serv = app.listen(PORT, () => { console.log(`Servidor HTTP escuchando el puerto ${serv.address().port}`); });
serv.on('error', error => console.log(`Error en el servidor: ${error}`));

//products.save({ title: "Test", price: 175, thumbnail: "" });
//products.getById(2);
//products.getAll();
//products.deleteById(4);
//products.deleteAll();