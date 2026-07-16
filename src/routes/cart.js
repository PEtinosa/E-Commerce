import { Router } from "express";
import { prisma } from "../config/db.js";
import { authMiddleware, generate_jwt } from "../middleware/authMIddleware.js";

export const cartRouter = Router();


// to get a cart

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the authenticated user's cart.
 *     description: This endpoint retrieves the cart belonging to the currently logged-in user.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */

cartRouter.get("/", authMiddleware, async (req,res)=>{
    try {
        // checking if the user exist or has an account has been done by authmiddleware
        
        const cart = await prisma.cart.findUnique({
            where:{
                userId: req.user.id
            }
        })
        res.status(200).json(cart);
    } catch (error) {
       console.log("error occured: ", error.message); 
       return res.status(500).json({ message: error.message }); 
    }
});

// to add an item to cart

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the authenticated user's cart.
 *     description: This endpoint creates a cart for the user if one does not already exist and adds a product to it.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               productId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Product added successfully.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       404:
 *         description: Product is unavailable.
 *       500:
 *         description: Internal server error.
 */

cartRouter.post("/", authMiddleware, async (req,res)=>{
    try {
        const { quantity, productId}= req.body

        // checking if the user exist or has an account is for authMiddleware
        

        // to check if this user has a cart already
       const exist_cart = await prisma.cart.findUnique({
            where:{
                userId: req.user.id,
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
        
        if(!exist_product)return res.status(404).json({message: "product is unavailable"});

        await prisma.cartItem.create({
            data:{
                quantity, productId, 
                cartId: cart.id
            } 
            });
             
        res.status(201).json({message: "product added successfully"});
    } catch (error) {
      console.log("error occured: ", error.message); 
       return res.status(500).json({ message: error.message });  
    }
});


// to delete a cart

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Delete the authenticated user's cart.
 *     description: This endpoint deletes the cart belonging to the currently logged-in user.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart deleted successfully.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */

cartRouter.delete("/", authMiddleware, async (req,res)=>{
    try {
        
        await prisma.cart.delete({
            where: {
                userId: req.user.id
            }
        });
        res.status(200).json({message:"cart deleted"});
    } catch (error) {
       console.log("error occured: ", error.message); 
       return res.status(500).json({ message: error.message }); 
    }
});