import { Router } from "express";
import { prisma } from "../config/db.js";
import { authMiddleware, generate_jwt } from "../middleware/authMIddleware.js";


export const userRouter = Router();

// Admins will be using this routes

// to add a user

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user.
 *     description: Creates and stores a new user in the database.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully.
 *       500:
 *         description: Internal server error.
 */

userRouter.post("/", async (req,res)=>{
    try {
        const {first_name, last_name, email, password} = req.body

        const newUser = await prisma.user.create({
            data:{first_name, last_name, email, password}
        });
        res.status(201).json({message: "user added successully",
            user: newUser
        });

    } catch (error) {
        console.log("error occured: ", error.message);
        return res.status(500).json({message: error.message});  
    }
});

// to get all users

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users.
 *     description: Retrieves all users from the database.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       500:
 *         description: Internal server error.
 */

userRouter.get("/", async (req,res)=>{
    try {
        const allUsers = await prisma.user.findMany();
        res.status(200).json(allUsers)

    } catch (error) {
       console.log("error occured: ", error.message);
        return res.status(500).json({message: error.message}); 
    }
});

// to get one user

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the authenticated user's details.
 *     description: This endpoint retrieves the details of the currently logged-in user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *       401:
 *         description: Unauthorized. Authentication token is missing or invalid.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

userRouter.get("/me", authMiddleware, async (req,res)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:req.user.id
            }
        });

        if(!user) return res.status(404).json({
            message:"user not found",
        });

      res.status(200).json(user);
    } catch (error) {
       console.log("error occured: ", error.message); 
       return res.status(500).json({ message: error.message })  
    }
});

// to update a user 

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user.
 *     description: Updates a user's information using their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

userRouter.put("/:id", async (req,res)=>{
    try {
        const{first_name, last_name, email, password} = req.body

        const updatedUser = await prisma.user.update({
            where:{
                id: Number(req.params.id)
            },

            data:{
                first_name, last_name, email, password
            }
        });
         res.status(200).json({message:"User updated",
            product: updatedUser
        });

    } catch (error) {
        console.log("error occured: ", error.message); 
        return res.status(500).json({ message: error.message }) 
    }
});

// to delete a user

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user.
 *     description: Deletes a user from the database using their ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

userRouter.delete("/:id", async (req,res)=>{
    try{
        const deletedUser = await prisma.user.delete({
            where:{
                id: Number(req.params.id)
            }
        });
        res.status(200).json({message:"user deleted"});

    }catch (error) {
        console.log("error occured: ", error.message); 
       return res.status(500).json({ message: error.message }) 
    }
});