import express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"; 
import { router as productsRouter } from "./routes/products.js";
import { router as usersRouter } from "./routes/users.js";
dotenv.config()

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

mongoose.connect(process.env.CONNECTION_STRING,{})
.then( ()=> console.log("connected to db"))
.catch((err)=>console.log(err));

app.get('/', (req,res)=>{
    res.send("hello world");
})

app.use("/products", productsRouter);
app.use("/users", usersRouter);



app.listen(8080, ()=> {
    console.log("server is running on http://localhost:8080/")
})