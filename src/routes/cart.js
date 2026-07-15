import { Router } from "express";
import { prisma } from "../config/db.js";

export const cartRouter = Router();


// to get a cart
cartRouter.get("/", async (req,res)=>{
    try {
        // check if the user exist or has an account
        const exist_user = await prisma.user.findUnique({
            where:{
                id: user.id
            }
        });
        if(!exist_user)return res.json({message: "please log in"});

        const cart = await prisma.cart.findUnique({
            where:{
                userId: user.id
            }
        })
        res.status(200).json(cart);
    } catch (error) {
       console.log("error occured: ", error.message); 
       return res.status(500).json({ message: error.message }); 
    }
});

// to add an item to cart
cartRouter.post("/items", async (req,res)=>{
    try {
        const { quantity, productId}= req.body

        // check if the user exist or has an account
        const exist_user = await prisma.user.findUnique({
            where:{
                id: user.id
            }
        });
        if(!exist_user)return res.json({message: "please log in"});


        // to check if this user has a cart already
       const exist_cart = await prisma.cart.findUnique({
            where:{
                userId: user.id,
            }
        });

        let cart = exist_cart

        if(!cart) {
            // this is saying, if the cart does not exist, create it
            cart = await prisma.cart.create({
                data:{
                    userId:user.id
                }
                
            })
        };

        /*
        this is to verify that the product actually exist and is
        not just a malicious product id, so it does not add to cart
        */ 
        const exist_product = await prisma.product.findUnique({
            where:{
                id: productId
            }
        });
        
        if(!exist_product)return res.json({message: "product is unavailable"});

        const cartItem = await prisma.cartItem.create({
            data:{
                quantity, productId, 
                cartId: cart.id
            } 
            });
             
        res.status(200).json({message: "product added successfully"});
    } catch (error) {
      console.log("error occured: ", error.message); 
       return res.status(500).json({ message: error.message });  
    }
});


// to delete a cart
cartRouter.delete("/cart", async (req,res)=>{
    try {
        const cart = await prisma.cart.findunique({
            where:{
                userId:user,
                items: cartItems
            }
        })
        res.status(200).json({message:"cart deleted"});
    } catch (error) {
       console.log("error occured: ", error.message); 
       return res.status(500).json({ message: error.message }); 
    }
});