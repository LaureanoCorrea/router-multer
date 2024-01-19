import { Router } from "express";
import ProductManager from "../productManager.js";


const router = Router();
const products = new ProductManager("./data.json");

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    await products.loadProducts();

    if (limit) {
      const limitedProducts = products
        .getProducts()
        .slice(0, parseInt(limit, 10));
      res.json(limitedProducts);
    } else {
      res.json(products.getProducts());
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    await products.loadProducts();

    const product = products.getProductById(parseInt(pid, 10));

    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const productValidation = products.validateProduct(product);
    if (productValidation) {
      res.status(400).json({ error: productValidation });
      return;
    }

    await products.loadProducts();

    const result = await products.addProduct(product);

    if (result.status === "error") {
      res.status(400).json({ error: result.message });
      return;
    }

    res.json({
      status: "success",
      message: "Producto agregado",
      data: { product: result.product },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedFields = req.body;

    await products.loadProducts();

    const result = await products.updateProduct(
      parseInt(pid, 10),
      updatedFields
    );

    if (typeof result === "string") {
      res.status(404).json({ error: result });
    } else {
      res.json({ message: result });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    await products.loadProducts();

    const result = await products.deleteProduct(parseInt(pid, 10));

    if (typeof result === "string") {
      res.status(404).json({ error: result });
    } else {
      res.json({ message: result });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
