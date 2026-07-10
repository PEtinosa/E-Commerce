import { Router } from "express";
import { prisma } from "../config/db.js";

export const userRouter = Router();

// Admins will be using this routes

// to add a user
userRouter.post("/users", async (req,res)=>{
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
userRouter.get("/users", async (req,res)=>{
    try {
        const allUsers = await prisma.user.findMany();
        res.status(200).json(allUsers)

    } catch (error) {
       console.log("error occured: ", error.message);
        return res.status(500).json({message: error.message}); 
    }
});

// to get one user
userRouter.get("/users/:id", async (req,res)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:Number(req.params.id)
            }
        });

        if(!user) return res.status(404).json({
            message:"user not found",
            user: user
        });

        res.json(user)
    } catch (error) {
       console.log("error occured: ", error.message); 
       return res.status(500).json({ message: error.message })  
    }
});

// to update a user 
userRouter.put("/user/:id", async (req,res)=>{
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
userRouter.delete("/user/:id", async (req,res)=>{
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