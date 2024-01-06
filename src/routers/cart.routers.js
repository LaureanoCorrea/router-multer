import { Router } from "express";
import CartManager from "../cartManager.js";

const router = Router();
const cartService = new CartManager();

router.post("/", async (req, res) => { //POST carrito
  try {
    const result = await cartService.createCart();
    res.send({
      status: "success",
      payload: result,
    });
  } catch (error) {
    res.status(500).json("error de server ${error.message}");
  }
});

router.get("/:cid", async (req, res) => { //GET id carrito
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(parseInt(cid));
    res.send({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    res.status(500).json( "Error al obtener carrito" );
  }
});

router.post("/:cid/products/:pid", async (req, res) => { //POST id producto de id carrito
  try {
    const {cid,pid} = req.params;
    const {quantity} = req.body;
 
    const result = await cartService.addProduct(Number(cid),Number(pid));

    res.send({
      status: "success",
      message: "Producto agregado al carrito",
      data: { cart: result.cart },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar al carrito" });
    console.log(error);
  }
});



export default router;
