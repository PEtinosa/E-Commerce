import { Router } from "express";
import { prisma } from "../config/db.js";
export const productRouter = Router();


// product routes

// to add a product
productRouter.post("/addproduct", async (req,res)=>{
    try {
        const { name, image, price} = req.body

        const newProduct = await prisma.product.create({
            data:{name, image, price}
        });
        res.status(201).json({message: "product added successfully", 
            product: newProduct});
    
    } catch (error) {
        console.log("error occured: ", error.message);
        return res.status(500).json({ message: error.message });
    }
});

// to get all products

productRouter.get("/products", async (req,res)=>{
    try {
        const allProducts = await prisma.product.findMany();

        // res.status(404).json({message:"proudct is unavailable"});
        /*
        removing this means if there is no product, Prisma returns an empty array ([]) 
        if there are no products
        the frontend can just displays the products available
        */ 
        res.status(200).json(allProducts)

    } catch (error) {
       console.log("error occured: ", error.message); 
       return res.status(500).json({ message: error.message });
    }
});

// to get one product
productRouter.get("/products/:id", async (req,res)=>{
    try {
        const product = await prisma.product.findUnique({
            where:{
                // id:Number(id)
                id:Number(req.params.id)
            }
        });

        if(!product) return res.status(404).json({
            message: "product is unavailable",
            product: product
        });

        res.json(product)

    } catch (error) {
       console.log("error occured: ", error.message); 
       return res.status(500).json({ message: error.message }) 
    }
});

// to update a product example changing the price
productRouter.put("/products/:id", async (req,res)=>{
    try {
        const {price,image}= req.body

        const updatedProduct = await prisma.product.update({
            where:{
                id: Number(req.params.id)
            },

            data:{
                price, image
            }
        });
        res.status(200).json({message:"product updated",
            product: updatedProduct
        });
       
    } catch (error) {
        console.log("error occured: ", error.message); 
        return res.status(500).json({ message: error.message }) 
    }
});

// to delete a product
productRouter.delete("/products/:id", async (req,res)=>{
    try {
        const deletedProduct = await prisma.product.delete({
            where:{
                id: Number(req.params.id)
            }
        });
        res.status(200).json({message:"product deleted"});
   
    } catch (error) {
        console.log("error occured: ", error.message); 
       return res.status(500).json({ message: error.message }) 
    }
});