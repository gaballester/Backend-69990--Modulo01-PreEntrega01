import { promises as fs } from "fs";

class CartManager {
  constructor(path) {
    (this.carts = []), (this.path = path);
  }

  getCarts = async () => {
    try {
      let cartsArray = await this.readFile();
      return cartsArray;
    } catch (error) {
      return "Error: ", error;
    }
  };

  getCartProducts = async (id) => {
    const carts = await this.getCarts();
    const cart = carts.find((cart) => cart.id === id);
    if (cart) {
      return cart.products;
    } else {
      return "Cart isn't available";
    }
  };

  addNewCart = async () => {
    const id = await this.getLastCartId();
    const newCart = { id, products: [] };
    this.carts = await this.getCarts();
    this.carts.push(newCart);
    this.saveFile(this.carts);
    return `new cart created: ${newCart}`;
  };

  addProducttoCart = async (cartId, productId) => {
    const carts = await this.getCarts();
    const index = carts.findIndex((cart) => cart.id === cartId);
    if (index != -1) {
      const cartProducts = await this.getCartProducts(cartId);
      const prodIndex = cartProducts.findIndex(product => product.productId === productId);
      if (prodIndex != -1) {
        cartProducts[prodIndex].quantity = cartProducts[prodIndex].quantity + 1;
      } else {
        const object = {
            "productId" : productId,
            "quantity" : 1
        } 
        cartProducts.push(object);
      }
      console.log(carts[index])
      carts[index].products = cartProducts;

      await this.saveFile(carts);
      console.log("product added to cart");
    } else {
      console.log("cart not found");
    }
  };

  // additional functions

  readFile = async () => {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      // convert JSON array will be parsed into a JavaScript array
      return JSON.parse(response);
    } catch (error) {
      console.log(`Error al leer archivo ${this.path}`, error);
    }
  };

  saveFile = async (cartArrays) => {
    try {
      await fs.writeFile(this.path, JSON.stringify(cartArrays, null, 2));
      return "carts file saved";
    } catch (error) {
      console.log(`Error writting file ${this.path}`, error);
      return error;
    }
  };

  getLastCartId = async () => {
    const carts = await this.readFile();
    let lastId = 1;
    if (carts.length > 0) {
      const cart = carts.reduce((previous, current) => {
        return current.id > previous.id ? current : previous;
      });
      lastId = product.id + 1;
    }
    return lastId;
  };
}
export { CartManager };
