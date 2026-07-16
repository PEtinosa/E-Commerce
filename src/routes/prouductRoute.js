import { Router } from "express";
import { prisma } from "../config/db.js";
export const productRouter = Router();


// product routes

// to add a product

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product.
 *     description: This endpoint creates a new product.
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product added successfully.
 *       500:
 *         description: Internal server error.
 */

productRouter.post("/", async (req,res)=>{
    try {
        const { name, image, price} = req.body

        const newProduct = await prisma.product.create({
            data:{name,
                 image, 
                 price:parseFloat(price)}
        });
        res.status(201).json({message: "product added successfully", 
            product: newProduct});
    
    } catch (error) {
        console.log("error occured: ", error.message);
        return res.status(500).json({ message: error.message });
    }
});

// to get all products

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products.
 *     description: This endpoint retrieves all available products together with their sizes.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products retrieved successfully.
 *       500:
 *         description: Internal server error.
 */

productRouter.get("/", async (req,res)=>{
    try {
        const allProducts = await prisma.product.findMany({
            include:{
                sizes: {
                    include:{
                        size: true
                    }
                }
            }
        });

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

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single product.
 *     description: This endpoint retrieves a product using its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID.
 *     responses:
 *       200:
 *         description: Product retrieved successfully.
 *       404:
 *         description: Product is unavailable.
 *       500:
 *         description: Internal server error.
 */

productRouter.get("/:id", async (req,res)=>{
    try {
        const product = await prisma.product.findUnique({
            where:{
                // id:Number(id)
                id:Number(req.params.id)
            },

             include:{
                sizes: {
                    include:{
                        size: true
                    }
                }
            }
        });

        if(!product) return res.status(404).json({
            message: "product is unavailable",
            product: product
        });

        return res.status(200).json(product)

    } catch (error) {
       console.log("error occured: ", error.message); 
       return res.status(500).json({ message: error.message }) 
    }
});

// to update a product example changing the price

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product.
 *     description: This endpoint updates a product's price and image using its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */

productRouter.put("/:id", async (req,res)=>{
    try {
        const {price,image}= req.body

        // Check whether the product exists.
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        const updatedProduct = await prisma.product.update({
            where:{
                id: Number(req.params.id)
            },

            data:{
                price:parseFloat(price),
                image
            }
        });
       return res.status(200).json({message:"product updated",
            product: updatedProduct
        });
       
    } catch (error) {
        console.log("error occured: ", error.message); 
        return res.status(500).json({ message: error.message }) 
    }
});

// to delete a product

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product.
 *     description: This endpoint deletes a product using its ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The product ID.
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */

productRouter.delete("/:id", async (req,res)=>{
    try {


        // Check whether the product exists.
        const existingProduct = await prisma.product.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        // then delete it when you find it
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