import fs from "fs";

export class ProductManager {
  constructor(data) {
    this.data = data;
  }

  async AddProduct(product) {
    const newProduct = {
      id: await this.GetId(),
      title: product.title ?? "Sin Titulo",
      description: product.description ?? "Sin Descripcion",
      price: product.price ?? "Sin Precio",
      thumbnail: product.thumbnail ?? "Sin imagen",
      code: product.code ?? "Sin codigo",
      stock: product.stock ?? "Sin stock",
    };

    const products = await this.GetAllProducts();
    products.push(newProduct);

    try {
      await fs.promises.writeFile(
        this.data,
        JSON.stringify(products, null, "\t")
      );
      console.log("Producto creado correctamente");
    } catch (e) {
      console.error("Error al crear el nuevo producto\n", e);
    }
  }

  async GetAllProducts() {
    try {
      const products = await fs.promises.readFile(this.data, "utf-8");
      return JSON.parse(products);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async GetId() {
    const products = await this.GetAllProducts();

    if (products.length > 0) {
      return parseInt(products[products.length - 1].id + 1);
    }
    return 1;
  }

  async UpdateProduct(id, product) {
    const products = await this.GetAllProducts();
    let productUpdated = {};

    for (let key in products) {
      if (products[key].id === id) {
        products[key].title = product.title
          ? product.title
          : product[key].title;
        products[key].description = product.description
          ? product.description
          : product[key].description;
        products[key].price = product.price
          ? product.price
          : product[key].price;
        products[key].code = product.code ? product.code : product[key].code;
        products[key].stock = product.stock
          ? product.stock
          : product[key].stock;

        productUpdated = product[key];
      }
    }

    try {
      await fs.promises.writeFile(
        this.data,
        JSON.stringify(products, null, "\t")
      );

      return productUpdated;
    } catch (e) {
      console.error(e);
      return {
        message: "Error al actualizar el producto",
      };
    }
  }

  async DeleteProduct(id) {
    const products = await this.GetAllProducts();
    const initLength = products.length;

    const productProccesed = products.filter((product) => product.id != id);

    const finalLenght = productProccesed.length;

    try {
      if (initLength == finalLenght) {
        throw new Error(`No fue posible eliminar el producto de id${id}`);
      }

      await fs.promises.writeFile(
        this.data,
        JSON.stringify(productProccesed, null, "\t")
      );

      return `El id ${id} del producto fue eliminado correctamente`;
    } catch (e) {
      return e.message;
    }
  }
}
