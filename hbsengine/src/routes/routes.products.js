const express = require("express");
const productsRouter = express.Router();
const Manager = require("../manager.js");
const manager = new Manager("src/bbdd.json");

const midProducts = (req, res, next) => {
  const { title, price, thumbnail } = req.body;
  if (!title || !price || !thumbnail) return res.status(400).send({ err: "This data is required!" });
  next();
};

productsRouter.get("/", async (req, res) => {
  const productos = await manager.getAll();
  res.render("products", { productos, subtitle: "Lista de Productos" });
});

productsRouter.post("/", midProducts, async (req, res) => {
  await manager.save(req.body);
  res.redirect("/");
});

productsRouter.get("/:id", async (req, res) => {
  res.send(await manager.getById(parseInt(req.params.id)));
});

productsRouter.put("/:id", async (req, res) => {
  res.send(await manager.modifyById(parseInt(req.params.id), req.body));
});

productsRouter.delete("/:id", async (req, res) => {
  res.send(await manager.deleteById(parseInt(req.params.id)));
});

module.exports = productsRouter;