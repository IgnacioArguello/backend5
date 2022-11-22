const fs = require("fs");

class Manager {
  constructor(pathToFile) {
    this._pathToFile = pathToFile;
  }
  async save(product) {
    if (!product.title || !product.price) return { status: "error", message: "missing Fields" };
    try {
      if (fs.existsSync(this._pathToFile)) {
        let data = await fs.promises.readFile(this._pathToFile, "utf-8");
        let products = JSON.parse(data);
        let id = products[products.length - 1].id + 1;
        product.id = id;
        products.push(product);
        await fs.promises.writeFile(this._pathToFile, JSON.stringify(products, null, 2));
        return { status: "success", message: "Producto Agregado", product };
      } else {
        product.id = 1;
        await fs.promises.writeFile(this._pathToFile, JSON.stringify([product], null, 2));
        return { status: "success", message: "Producto Agregado", product };
      }
    } catch (error) {
      return { status: "error", message: error.message };
    }
  }
  async modifyById(id, obj) {
    if (!id) return { status: "error", message: "Indique el Id por favor" };
    if (fs.existsSync(this._pathToFile)) {
      let data = await fs.promises.readFile(this._pathToFile, "utf-8");
      let products = JSON.parse(data);
      let productId = products.findIndex((prod) => prod.id === id);
      if (productId !== -1) {
        products[productId] = {
          ...products[productId],
          id: id,
          title: obj.title,
          price: obj.price,
          thumbnail: obj.thumbnail,
        };
        await fs.promises.writeFile(this._pathToFile, JSON.stringify(products, null, 2));
        return { status: "success", message: "Producto Modificado" };
      }
      return { status: "error", message: "Producto no Encontrado" };
    } else {
      return { status: "error", message: "Ocurrio un error" };
    }
  }
  async getById(id) {
    if (!id) return { status: "error", message: "Indique el Id por favor" };
    if (fs.existsSync(this._pathToFile)) {
      let data = await fs.promises.readFile(this._pathToFile, "utf-8");
      let products = JSON.parse(data);
      let productId = products.find((prod) => prod.id === id);
      if (productId) return { status: "success", message: productId };
      return { status: "error", message: "Producto no Encontrado" };
    } else {
      return { status: "error", message: "Ocurrio un error" };
    }
  }
  async getAll() {
    if (fs.existsSync(this._pathToFile)) {
      let data = await fs.promises.readFile(this._pathToFile, "utf-8");
      let products = await JSON.parse(data);
      return { status: "success", message: products };
    } else {
      return { status: "error", message: "Ocurrio un error en la base de datos" };
    }
  }
  async deleteById(id) {
    if (!id) return { status: "error", message: "Indique el Id por favor" };
    if (fs.existsSync(this._pathToFile)) {
      let data = await fs.promises.readFile(this._pathToFile, "utf-8");
      let products = JSON.parse(data);
      let validation = products.some((prod) => prod.id === id);
      if (validation) {
        let newProductsArray = products.filter((prod) => prod.id !== id);
        await fs.promises.writeFile(this._pathToFile, JSON.stringify(newProductsArray, null, 2));
        if (newProductsArray.length === 0) {
          this.deleteAll();
          return { status: "Success", message: "Producto Eliminado, no hay mas productos" };
        }
        return { status: "success", message: "Producto Eliminado" };
      } else {
        return { status: "error", message: "No existe producto con ese ID" };
      }
    } else {
      return { status: "error", message: "Ocurrio un error" };
    }
  }
  async deleteAll() {
    if (fs.existsSync(this._pathToFile)) {
      await fs.promises.unlink(this._pathToFile);
      return { status: "Success", message: "Todos los productos fueron eliminados" };
    } else {
      return { status: "error", message: "Ocurrio un error" };
    }
  }
}

module.exports = Manager;