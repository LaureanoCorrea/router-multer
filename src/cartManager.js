import { promises as fs } from "fs";

class CartManager {
  constructor(path) {
    this.path = "./src/jsonDB/cart.json";
  }
  async readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async createCart() {
    try {
      const carts = await this.readFile();
      let newCart = {
        id: carts.length + 1,
        products: [],
      };
      carts.push(newCart);
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");
      return newCart;
    } catch (error) {
      return "Error al crear el carrito";
    }
  }

  async getCartById(cid) {
    try {
      const carts = await this.readFile();
      const cart = carts.find((cart) => cart.id === cid);
      if (!cart) {
        return "no se encuentra el carrito";
      }
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(cid, pid) {
    try {
      const carts = await this.readFile();
      const cartIdx = carts.findIndex(cart => cart.id === cid);

      if (cartIdx === -1) {
        return { status: "error", message: "Carrito no encontrado" };
      }

      const productIdx = carts[cartIdx].products.findIndex(
        product => product.product === pid
      );

      if (productIdx === -1) {
        carts[cartIdx].products.push({ product: pid, quantity: 1 });
      } else {
        carts[cartIdx].products[productIdx].quantity += 1;
      }

      await fs.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");

      return carts[cartIdx];
    } catch (error) {
      return error;
    }
  }
}

export default CartManager;
