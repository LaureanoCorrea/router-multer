import { promises as fs } from "fs";
import CartManager from "./cartManager.js";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  async saveProducts() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      await fs.writeFile(this.path, data, "utf-8");
    } catch (error) {
      console.error("Error al guardar productos:", error);
    }
  }

  validateProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      return "Todos los campos son obligatorios";
    }
    return null;
  }

  async addProduct(product) {
    await this.loadProducts();
    const productValidation = this.validateProduct(product);
    if (productValidation) {
      return { status: "error", message: productValidation };
    }

    const noRepeatCode = this.products.find(
      (prod) => prod.code === product.code
    );
    if (noRepeatCode) {
      return {
        status: "error",
        message: "Ya existe un producto con ese código",
      };
    }

    const newProduct = {
      ...product,
      id:
        this.products.length === 0
          ? 1
          : this.products[this.products.length - 1].id + 1,
    };
    this.products.push(newProduct);

    await this.saveProducts();

    return {
      status: "success",
      message: "Producto agregado correctamente",
      product: newProduct,
    };
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        await this.saveProducts();
      } else {
        console.error("Error al cargar productos:", error);
        this.products = [];
        throw error;
      }
    }
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((prod) => prod.id == id);
    if (!product) {
      return "Producto no encontrado";
    }
    return product;
  }

  async updateProduct(id, updatedFields) {
    const index = this.products.findIndex((prod) => prod.id === id);
    if (index === -1) {
      return "Producto no encontrado";
    }

    this.products[index] = {
      ...this.products[index],
      ...updatedFields,
    };

    await this.saveProducts();
    return "Producto actualizado correctamente";
  }

  async deleteProduct(id) {
    const index = this.products.findIndex((prod) => prod.id === id);
    if (index === -1) {
      return "Producto no encontrado";
    }

    this.products.splice(index, 1);

    await this.saveProducts();
    return "Producto eliminado correctamente";
  }
}

(async () => {
  const products = new ProductManager("./jsonDB/products.json");
})();

export default ProductManager;
