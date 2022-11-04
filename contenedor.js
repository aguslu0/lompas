const fs = require('fs');

class Contenedor {
    constructor(archive) { this.archive = archive; }

    exists(archive) {
        try {
            if(!fs.existsSync(archive)) { 
                throw new Error('El archivo no existe'); 
            } else { 
                return true; 
            }
        } catch(error) { console.log(`Error buscando el archivo: ${error.message}`); }
    }

    async writeFile(archive, data) { await fs.writeFileSync(archive, JSON.stringify(data, null, 2)); }

    async readFile(archive) {
        try {
            const data = await fs.readFileSync(archive);
            return JSON.parse(data);
        } catch(error) { console.log(`Error leyendo el archivo: ${error.message}`); }
    }

    async save(product) {
        try {
            if(!this.exists(this.archive)) {
                console.log(`Creando nuevos datos...`);

                let aProducts = [];
                product = { id: 1, ...product };
                aProducts.push(product);
                console.log(`Agregando producto...`);

                await fs.writeFile(this.archive, aProducts);
                console.log(`Se agregó el producto nuevo con el id: ${product.id}`);

                return product.id;
            } else {
                if(this.readFile(this.archive)) {
                    console.log(`Leyendo archivo...`);
                    const data = await this.readFile(this.archive);

                    if(data.length === 0) {
                        product = { id: 1, ...product };
                    } else {
                        let lastId = data[data.length - 1].id;
                        product = { id: lastId + 1, ...product };
                    }

                    console.log(`Agregando producto al archivo...`);
                    data.push(product);

                    this.writeFile(this.archive, data);
                    console.log(`Se agrego el nuevo producto con el id: ${product.id}`);

                    return product.id;
                }
            }
        } catch(error) { console.log(`Error agregando el producto: ${error.message}`); }
    }

    async getById(id) {
        try {
            if(this.exists(this.archive)) {
                const data = await this.readFile(this.archive);
                const dataId = data.filter(item => item.id === id);

                if(dataId.length === 0) {
                    throw new Error("No se encontro un producto con el id solicitado");
                } else {
                    //console.log(`Producto con id ${id} encontrado:\n`, dataId);
                    return dataId;
                }
            }
        } catch(error) { console.log(`Error buscando producto con el id: ${error.message}`); }
    }

    async getAll() {
        try {
            if(this.exists(this.archive)) {
                //console.log(`Leyendo archivo...`);
                const data = await this.readFile(this.archive);

                if(data.length !== 0) {
                    /*console.log(`Archivo con contenido:`);
                    console.log(data);*/
                    return data;
                } else {
                    throw new Error(`El archivo ${this.archive} esta vacio`);
                }
            }
        } catch(error) { console.log(`Error obteniendo todos los productos: ${error.message}`); }
    }

    async modifyById(id, newData) {
        try {
            let data = await this.readFile(this.archive);
            let dataId = data.filter(item => item.id === id);

            if(dataId.length === 0) { throw new Error(`Error encontrando el archivo con id: ${id}`); }

            data = data.filter(item => item.id !== id);
            dataId = { id: id, ...newData };
            data.push(dataId);

            this.writeFile(this.archive, data);
            return dataId;
        } catch(error) { console.log(`Error modificando el producto: ${error.message}`); }
    }

    async deleteById(id) {
        try {
            if(this.exists(this.archive)) {
                const data = await this.readFile(this.archive);
                console.log(`Buscando producto con el id solicitado...`);

                if(data.some(item => item.id === id)) {
                    const data = await this.readFile(this.archive);
                    console.log(`Eliminando producto con id solicitado...`);

                    const datos = data.filter(item => item.id !== id);
                    this.writeFile(this.archive, datos);
                    console.log(`Producto con el id ${id} eliminado`);
                } else {
                    throw new Error(`No se encontro el producto con el id ${id}`);
                }
            }
        } catch(error) { console.log(`Ocurrio un error eliminando el producto con el id solicitado: ${error.message}`); }
    }

    async deleteAll() {
        try {
            let newArray = [];
            console.log(`Borrando datos...`);

            await this.writeFile(this.archive, newArray);
            console.log(`Se borraron todos los datos del archivo ${this.archive}`);
        } catch(error) { console.log(`Ocurrio un error eliminando los datos: ${error.message}`); }
    }
}

module.exports = Contenedor;