import  express  from "express";
import { Product } from "../schemas/product.js";

export const router = express.Router();

router.get("/", async (req, res) => {
  const id = req.query.id;
  if (id) {
    try {
      const product = await Product.findById(id);
      if (!product) {
        res.status(404).send({ message: "Product not found" });
        return;
      }
      res.send(product);
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: "Invalid product ID" });
    }
  } else {
    try {
      const page = parseInt(req.query.page || "1");
      const perPage = parseInt(req.query.perPage || "10");
      const minPrice = parseInt(req.query.minPrice || "0");
      const maxPrice = parseInt(req.query.maxPrice || "999999999999");

      const filter = { price: { $gte: minPrice, $lte: maxPrice } };
      const products = await Product.find(filter)
        .skip((page - 1) * perPage)
        .limit(perPage);

      res.send(products);
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: "Error retrieving products" });
    }
  }
});

router.post("/", async (req, res) => {
    try {
      const body = req.body;
      const newProduct = new Product({
        name: body.name,
        price: body.price,
      });
      const data = await newProduct.save();
      console.log(body);
      res.send(data);
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Validation failed" });
    }
  });
  

router.delete("/", async (req, res) => {
  try{
    const id = req.query.id;
    if (id) {
      await Product.deleteOne( {"_id": id})
      res.status(200).send({ message: "Product deleted" });
    } else {
      res.status(400).send({ message: "Product not found" });
    }
  }catch (error) {
    console.error(error);
  }
})

router.put('/', async (req, res) => {
  try {
    const id = req.query.id;
    const updateData = req.body;
    const options = { new: true };
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, options);
    res.send(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: 'Invalid product ID' });
  }
});