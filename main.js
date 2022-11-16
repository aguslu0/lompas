// Librerias
const contenedor = require('./contenedor.js');
const express = require('express');
const { Router } = express;
const handlebars = require('express-handlebars');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

// Configuración
const app = express();
const router = Router();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.engine(
    "hbs",
    handlebars.engine({
        extname: "hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views"
    })
);

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'))

// Variables
const PORT = 8080;
const products = new contenedor("./products.json");

const messages = [];

// Endpoints
// Renderizamos el index con el formulario y los productos en HBS
router.get('/', async(req, res) => {
    const aProducts = await products.getAll();

    res.render('productos', {
        aProducts: aProducts 
    });
});

router.get('/producto/:id', async(req, res) => {
    const productId = parseInt(req.params.id);
    const aProduct = await products.getById(productId);

    res.json(aProduct);
});

router.post('/', (req, res) => {
    const product = req.body;
    products.save(product);

    res.json(product);
});

router.put('/producto/:id', async(req, res) => {
    const productId = parseInt(req.params.id);
    const newData = req.body;
    
    await products.modifyById(productId, newData);
    res.send("ok");
});

router.delete('/producto/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    products.deleteById(productId);

    res.send('ok');
});

app.use('/', router);

// Escuchamos el servidor en el puerto indicado
const serv = httpServer.listen(PORT, () => { console.log(`Servidor HTTP escuchando el puerto ${serv.address().port}`); });

// En caso de error con el servidor lo imprimimos en consola
serv.on('error', error => console.log(`Error en el servidor: ${error}`));

// Hacemos conexión con sockets
io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado');

    socket.emit('messages', messages);

    socket.on('new-message', data => {
        messages.push(data);
        io.sockets.emit('messages', messages);
    });
});

//products.save({ title: "Test", price: 175, thumbnail: "" });
//products.getById(2);
//products.getAll();
//products.deleteById(4);
//products.deleteAll();