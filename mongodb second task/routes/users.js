import express from "express";
import { User } from "../schemas/user.js";
import { Product } from "../schemas/product.js";
// import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const router = express.Router();

// router.post("/login", async(req, res)=>{
//     const {email, password} = req.body;
//     const user = await User.findOne({email: email, password: password})
//     if (!user) res.status(401).json({status: "error", message:"Unauthenticated"})

//     const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
//     res.json({status: "success", token: token})


// })

const userschema = {
    name: "String",
    email: "must be a valid email address",
    password: "string"
}

router.post("/", async(req, res)=>{
    const {name, email, password}= req.body;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (emailRegex.test(email)){
        try{
            const existingUser = await User.findOne({email: email});
            if(existingUser){
                res.send("email already registered");
            } else {
                const newUser = new User({
                                    name: name,
                                    email: email,
                                    password: password
                                });
                                const savedUser = await newUser.save();
                                res.send(savedUser);
            }
        } catch (error){
            res.send(error.message);
        }
    } else res.json(userschema);


});

router.get("/", async (req, res) => {
    const id = req.query.id;
    if(id){
        try {
            const user = await User.findById(id);
            if (!user){
                res.status(404).json({status: "error", message:"User not found"})
                return;
            }
            res.json(user);
        }catch (err) {
            console.error(err);
            res.status(400).send({ message: "Invalid user ID" });
        }
    } else {
        try {
            const users = await User.find();
            res.json(users);
        }catch (err) {
            console.error(err);
            res.status(400).send(err.message);
        }
    }
})

router.put('/', async (req, res) => {
    const userId = req.query.id;
    const { id } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (user) {
        const product = await Product.findById(id);
        
        if (product) {
            await User.updateOne(
                { _id: userId },
                { $addToSet: { products: product } }
              );
          res.send(user);
        } else {
          res.send('Product not found');
        }
      } else {
        res.send('User not found');
      }
    } catch (error) {
      res.send(error.message);
    }
  });

router.patch('/', async (req, res) => {
    try {
      const id = req.query.id;
      const updateData = req.body;
      const options = { new: true };
      const updateduser = await User.findByIdAndUpdate(id, updateData, options);
      res.send(updateduser);
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: 'Invalid product ID' });
    }
  });

  router.delete("/", async (req, res) => {
    try{
      const id = req.query.id;
      if (id) {
        await User.deleteOne( {"_id": id})
        res.status(200).send({ message: "user deleted" });
      } else {
        res.status(400).send({ message: "user not found" });
      }
    }catch (error) {
      console.error(error);
    }
  })