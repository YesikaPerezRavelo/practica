import express from "express";
import { ProductManager } from "./productManager.js";

const PM = new ProductManager("products.json");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/products", async (req, res) => {
  res.send(await PM.GetAllProducts());
});

app.post("/api/products", async (req, res) => {
  const response = await PM.AddProduct(req.body);
  res.status(201).send(response);
});

app.put("/api/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  res.send(await PM.UpdateProduct(pid, req.body));
});

app.delete("/api/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  res.send(await PM.DeleteProduct(pid));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor activo http://localhost:${PORT}`);
});
