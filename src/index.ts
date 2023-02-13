const express = require("express");

import { AppDataSource } from "./data-source";
import { Product } from "./entity/Product";
import { Validate } from "./validate";
const cors = require("cors");
const path = require("path");

const dotenv = require("dotenv");
const app = express();
dotenv.config();

app.use(cors());

const multer = require("multer");

AppDataSource.initialize()
  .then(async () => {
    console.log("Database Connected");
  })
  .catch((error) => console.log(error));

app.use(express.json());

app.get("/api/v1/products", async (req, res) => {
  try {
    const products = await AppDataSource.manager.find(Product,{
      order: {
        id:"DESC"
      }
    });
    res.send(products);
  } catch (error) {
    res.json(error.message);
  }
});

//MULTER FOR IMAGES TO BE UPLOADED
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/image/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.sendFile(path.join(__dirname, "public", `${imageName}`));
});

const upload = multer({ storage });

app.post("/api/v1/product", upload.array("images"), async (req, res) => {
  const product = new Product();
  const data = req.body;
  const result = Validate(data);
  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  product.name = data["name"];
  product.price = data["price"];
  product.sku = data["sku"];
  product.desc = data["desc"];
  product.images = req.files.map((file) => file.filename);

  try {
    await AppDataSource.manager.save(product);

    res.json({
      success: true,
      id: product.id,
    });
  } catch (error) {
    res.json(error.message);
  }
});

app.put("/api/v1/update/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const product = await AppDataSource.manager.findOne(Product, {
      where: { id },
    });
    if (!product) {
      res.status(404).send({ error: "Product not found" });
      return;
    }

    Object.assign(product, data);
    await AppDataSource.manager.save(product, data);
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.json(error.message);
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
