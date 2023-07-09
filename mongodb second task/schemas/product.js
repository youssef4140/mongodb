import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true},
    price: {type: Number, required: true}
})

export const Product = mongoose.model("products", productSchema, "products")


