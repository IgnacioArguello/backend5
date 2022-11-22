const express = require("express");
const path = require("path");
const PORT = 8080;
const app = express();
const productsRouter = require("./routes/routes.products");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/productos", productsRouter);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("form", { subtitle: "Carga de Productos" });
});

app.listen(PORT, () => {
  console.log(`>>>>>Server Up! Port: ${PORT} <<<<<`);
});