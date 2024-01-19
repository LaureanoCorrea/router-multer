import express from 'express'
const app = express();
import productsRouter from './routers/products.routers.js';
import cartRouter from './routers/cart.routers.js';  


app.use(express.json());

app.use('/api/products', productsRouter);

app.use('/api/carts', cartRouter);


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Escuchando el puerto ${PORT}`);
});
