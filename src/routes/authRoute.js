import { Router } from "express";
import bcrypt from "bcrypt";
import { send_mail } from "../utils/send_email.js";
import { generate_code } from "../utils/generate_code.js";
import { prisma} from "../config/db.js";
import { authMiddleware, generate_jwt } from "../middleware/authMIddleware.js";

export const authRouter = Router();


/**
 * @swagger
 * /auth/register:
 *   post:
 *      summary: Register a new user endpoint
 *      description: This endpoint registers a new user.
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                first_name:
 *                  type: string
 *                last_name:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        201:
 *          description: User created successfully.
 *        400:
 *          description: Invalid request or user already exists.
 *        500:
 *          description: Internal server error.
 */

authRouter.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // check edge cases
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "email and password is required" });

    // check if user exist

    const exist_user = await prisma.user.findUnique({
      where:{
        email: email
      }
    }); 
    if(exist_user) return res.status(400).json({message: "user already exist"});
    // hash password
    const hashed_password = await bcrypt.hash(password, 5);

    // save user to DB

    const user = {
      first_name,
      last_name,
      email,
      password: hashed_password, 
      // are we still using this hashed password database?
      
    };

    const created_user = await prisma.user.create({
      data: user
    });

    // generate code
    const code = generate_code(6); 

    // store code for user
    const verify = await prisma.verification.create({
      data: {user_id: created_user.id, code: code, password:hashed_password}
    });

    // send email confirmation
    await send_mail(
        user.email,
        "Email Verification",
        `Welcome ${user.first_name}, your OTP for email confirmation is ${verify.code}.`
    );

    res.status(201).json({ message: "user created successfully", data: user });
  } catch (error) {
    console.log("error occured: ", error.message);
    return res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *      summary: Verify user email endpoint
 *      description: This endpoint verifies a user's email using a verification code.
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *      responses:
 *        200:
 *          description: User verified successfully.
 *        400:
 *          description: Invalid or missing verification code.
 *        404:
 *          description: User not found.
 *        500:
 *          description: Internal server error.
 */

authRouter.post("/verify-email", async(req, res) => {

  try {
      // we are verifying using the cod that the user will input on the forntend
      const { code } = req.body;
      
      console.log("code: ", code);

      /*
      we also have to check for an empty input bar, just incase
      the user tries to submit the form without actually inputting the 
      code.
      */
      if (!code) {
        return res.status(400).json({ message: "Verification code is required." });
      }
      /*
      if the code is present, we have to verify the code, by checking if
      its the same one we have in our data base, (we coded for this in the 
      registration route)
      */ 

      const verification = await prisma.verification.findUnique({
        where: {
          code: code
        }
      });

      // Check if the code exists in db
      if (!verification) {
        return res.status(400).json({ message: "Invalid verification code." });
      }

      // check for the existing user
      const exist_user = await prisma.user.findUnique({
        where:{
          id:  verification.user_id
        }
      }); 

      if (!exist_user) {
        return res.status(404).json({ message: "User not found." });
      };

    /*
    since the user exist, you have to make sure that the user is 
    marked as verified from the user model
    */ 
    await prisma.user.update({
        where: { id: exist_user.id},
        
        data: {isVerified: true}
      });

    /* since the user has been verified, you want to delete the
    code from your record so that it wont be used again
    */
   await prisma.verification.delete({
      where: {code: code}
    });

    return res.status(200).json({ message: "User verified successfully" });

    } catch (error) {
      console.log("error occured: ", error.message);
      return res.status(500).json({ message: error.message });
    }

});

/**
 * @swagger
 * /auth/login:
 *   post:
 *      summary: Login user endpoint
 *      description: This endpoint authenticates a user and returns a JWT token.
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *      responses:
 *        200:
 *          description: Login successful.
 *        400:
 *          description: Invalid email or password.
 *        401:
 *          description: Wrong credentials.
 *        500:
 *          description: Internal server error.
 */

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("email: ", email, "password: ", password );
  
  // check edge cases
  if (!email || !password)
    return res.status(400).json({ message: "email and password is required" });

  // check if user exist

  const exist_user = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });
  if (!exist_user)
    return res.status(400).json({ message: "wrong credentials" });


  // compare password
  const is_match = await bcrypt.compare(password, exist_user.password);

  // edge cases
  if (!is_match) return res.status(401).json({ message: "wrong credentials" });

  // generate jwt

  const jwt_token = await generate_jwt({user_id: exist_user.id})

  // return user
  return res.status(200).json({ message: "success", data: exist_user, token:jwt_token });
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *      summary: Forgot password endpoint
 *      description: This endpoint sends an OTP to the user's email for password reset.
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *      responses:
 *        200:
 *          description: OTP sent successfully.
 *        400:
 *          description: Email is required.
 *        404:
 *          description: User not found.
 *        500:
 *          description: Internal server error.
 */

authRouter.post("/forgot-password", async (req, res) => {
  
  
  try {

    const { email} = req.body;
    const code = generate_code(6);

    if (!email) return res.status(400).json({ error: "email is required" });


    const exist_user = await prisma.user.findUnique({
      where:{
        email: email
      }
    }); 

  if (!exist_user) return res.status(404).json({ message: "user not found"})
    /*
      but the best case scenerio is to respond by saying 
      "email sent"
    */
    send_mail(
      exist_user.email,
      "Password Reset",
      `${exist_user.first_name}, your password reset OTP is ${code}.`
    );
    
    // This is to verify the user by id
    const verify = await prisma.verification.findFirst({
      where: {user_id: exist_user.id},
    })
    
    /*
    this is to say if the user is verified or the user verification record
    is found then you should update the user record
    */  
    if(verify){

      await prisma.verification.update({
      where: {id: verify.id},
      data:{code:code}
      // this  is to update the code when the user has inputed it
    })

    // but if there is no verification  record, then create one
    }else{
      await prisma.verification.create({
        data: {
          user_id: exist_user.id,
          code: code,
        },
      });
    }

    return res.status(200).json({ message: "OTP sent"});
  } catch (error) {
    console.log("error occured: ", error.message);
    return res.status(500).json({ message: error.message });
  }
    
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *      summary: Reset password endpoint
 *      description: This endpoint resets the user's password using a verification code.
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                code:
 *                  type: string
 *      responses:
 *        200:
 *          description: Password reset successfully.
 *        400:
 *          description: Invalid code or missing fields.
 *        500:
 *          description: Internal server error.
 */

  authRouter.post("/reset-password", async (req,res)=>{
    const {password, code} = req.body;
    /*
    check if the "id" is supoosed to be here, because you want to
    verify that the code that was inputed matches the user that 
    it was sent to.
    */ 
    try {
      // check if the input bar is empty
      if (!password || !code) {
        return res.status(400).json({
          message: "All fields are required.",
        });
      }
      
      const actual_code = await prisma.verification.findUnique({
        where: {
            code: code,
        },
      });

      if (!actual_code) {
      return res.status(400).json({
        message: "Invalid code.",
      });
      };


      
    // Find the user attached to the verification code
    const exist_user = await prisma.user.findUnique({
      where: {
        id: actual_code.user_id,
      },
    });

      if(!exist_user)
        return res.status(400).json({message: "invalid code"});
      /*
      I used "invalid code" above instead of  invalid user,for secuirty 
      purposes, so they can't tell if a user does not exist
      */ 

      // hash the password the user has given
      const hashed_password = await bcrypt.hash(password, 5);

      await prisma.user.update({
          where: {
            id: exist_user.id,
          },
          data:{
            password:hashed_password
          }
        });

        
    // Delete the verification record so the code cannot be used again
    await prisma.verification.delete({
      where: {
        code: code,
      },
    });

    return res.status(200).json({message: "Password reset successSfully"});
  }

     catch (error) {
       console.log("error occured: ", error.message);
      return res.status(500).json({ message: error.message });
    }
  });

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *      summary: Change password endpoint
 *      description: This endpoint allows an authenticated user to change their password.
 *      tags: [Authentication]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                current_password:
 *                  type: string
 *                new_password:
 *                  type: string
 *      responses:
 *        200:
 *          description: Password changed successfully.
 *        400:
 *          description: Missing fields or user not found.
 *        401:
 *          description: Current password is incorrect.
 *        500:
 *          description: Internal server error.
 */

  authRouter.put ("/change-password", authMiddleware, async (req,res)=>{
  // const {password, id}= req.body
  const { current_password, new_password } = req.body;

  try {

    if ( !current_password || !new_password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    };

    const exist_user = await prisma.user.findUnique({
      where:{
        id: req.user.user_id
      }
    }); 

    if (!exist_user)
    return res.status(400).json({ message: "User not found" });

    //  compare if the password in the database is the same with the one the user inputed 
   const is_match = await bcrypt.compare(current_password, exist_user.password);

    // edge cases
    if (!is_match) return res.status(401).json({ message: " Current password is Incorrect" });

    // Hash the new password if it is a match
    const hashed_password = await bcrypt.hash(new_password, 5);

    await prisma.user.update({
      where: { id: req.user.user_id },
      data: { password: hashed_password },
    });
     
   return res.status(200).json({ message: "password changed successfuly" });

  } catch (error) {
    console.log("error occured: ", error.message);
    return res.status(500).json({ message: error.message });
  }

});


/**
 * @swagger
 * /auth/logout:
 *   post:
 *      summary: Logout user endpoint
 *      description: This endpoint logs out the current user.
 *      tags: [Authentication]
 *      responses:
 *        200:
 *          description: Logged out successfully.
 *        500:
 *          description: Internal server error.
 */

authRouter.post("/logout", async (req, res) => {
  try {

    return res.status(200).json({
      message: "Logged out successfully."
    });

  }catch (error) {
    console.log(error.message);
    return res.status(500).json({message: "Internal server error."});
  }
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *      summary: Get authenticated user endpoint
 *      description: This endpoint returns the currently authenticated user's information.
 *      tags: [Authentication]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: User retrieved successfully.
 *        401:
 *          description: Unauthorized.
 *        500:
 *          description: Internal server error.
 */

// Protected routes
authRouter.get("/me", authMiddleware,async (req,res)=>{

});

