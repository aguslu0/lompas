const Contenedor = require('./contenedor.js');
const Express = require('express');

const products = new Contenedor("./products.json");

const app = Express();
const PORT = 8080;

const server = app.listen(PORT, () => { console.log(`Servidor HTTP escuchando el puerto ${server.address().port}`); });
server.on('error', error => console.log(`Error en el servidor: ${error}`));

app.get('/', (req, res) => {
    try {
        res.send('<h1>Lompas</h1><em>Ropa y accesorios unisex</em>');
    } catch(error) { console.log(`Error cargando la app: ${error}`); }
})

app.get('/productos', (req, res) => {
    const productList = async() => {
        try {
            const aProducts = await products.getAll();
            let productsCards = ``;

            aProducts.map( item => (
                productsCards += `<div><h2>${item.title}</h2><p>$${item.price}</p><img height='200px' src='${item.thumbnail}' alt='${item.title}' /></div>`
            ));

            res.send(`<h1>LOMPAS Indumentaria</h1> ${productsCards}`);
        } catch(error) { console.log(`Error al obtener los productos: ${error}`); }
    }

    productList();
});

app.get('/productoRandom', (req, res) => {
    const randomProduct = async() => {
        try {
            const aProducts = await products.getAll();
            let randomNum = Math.floor(Math.random() * aProducts.length);

            res.send(`<h1>${aProducts[randomNum].title}</h1> <p>$${aProducts[randomNum].price}</p> <img height='200px' src='${aProducts[randomNum].thumbnail}' alt='${aProducts[randomNum].title}' />`);
        } catch(error) { console.log(`Error obteniendo producto random: ${error}`); }
    }

    randomProduct();
});

//products.save({ title: "Test", price: 175, thumbnail: "" });
//products.getById(2);
//products.getAll();
//products.deleteById(4);
//products.deleteAll();