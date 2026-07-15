import { Router } from "express";
import bcrypt from "bcrypt";
import { send_mail } from "../utils/send_email.js";
import { generate_code } from "../utils/generate_code.js";
import { prisma} from "../config/db.js";
import { authMiddleware, generate_jwt } from "../middleware/authMIddleware.js";

export const authRouter = Router();

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
    send_mail({
      recipient_email: user.email,
      email_type: "email confirmation",
      template: `welcome ${user.first_name}, your otp for email confirmation code is
        ${verify.code}`,
    });

    res.status(201).json({ message: "user created successfully", data: user });
  } catch (error) {
    console.log("error occured: ", error.message);
    return res.status(500).json({ message: error.message });
  }
});



authRouter.post("/verify-email/", async(req, res) => {

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
    send_mail({
      recipient_email: exist_user.email,
      email_type: "forgot password",
      template: `${exist_user.first_name}, your otp for email confirmation code is
        ${code}`,
    });

    const verify = await prisma.verification.findFirst({
      where: {user_id: exist_user.id},
    })

    const update = await prisma.verification.update({
      where: {id: verify.id, user_id: exist_user.id},
      data:{code:code}
      // this  is to update the code when the user has inputed it
    })

    await prisma.user.update({
      where: { id: exist_user.id },
      data: { isVerified: true }
      // this is to update and ensure that the user is now verified
    });

   res.status(200).json({ message: "OTP sent"});
  } catch (error) {
    console.log("error occured: ", error.message);
    return res.status(500).json({ message: error.message });
  }
    
});

  authRouter.post("/reset-password", async (req,res)=>{
    const {id, password, code} = req.body;
    /*
    check if the "id" is supoosed to be here, because you want to
    verify that the code that was inputed matches the user that 
    it was send to.
    */ 
    try {
      const exist_user = await prisma.user.findUnique({
        where: {
          id: Number(id)
        }
        
      });

      if(!exist_user)
        return res.status(400).json({message: "invalid code"});
      /*
      I used "invalid code" above instead of  invalid user,for secuirty 
      purposes, so they can't tell if a user does not exist
      */ 

      // to verify if theres a user with the code inputed
      const actual_code = await prisma.verification.findFirst({
        where:{
          user_id:exist_user.id,
          code:code
        }
      });
      
      if(!actual_code)
        return res.status(400).json({message: "invalid code"});
    

      await prisma.user.update({
      where: {id: exist_user.id},
      data: {isVerified: is_match}
    });

    /*
    Since you have alreagy checked if the otp the user sent is 
    correct in the "actual code" block, there is no need to 
    check the "is-match" you can just go ahead and hash the 
    new password that the user has inputed.
    */ 
   
    // hash the password the user has given
    const hashed_password = await bcrypt.hash(password, 5);

    const updatedUser = await prisma.user.update({
          where: {
            id: Number(id)
          },
          data:{
            password:hashed_password
          }
        });
    return res.status(200).json({message: "pasword reset successSfully"});
  }

     catch (error) {
       console.log("error occured: ", error.message);
      return res.status(500).json({ message: error.message });
    }
  });

  authRouter.put ("/change-password", async (req,res)=>{
  const {password, id}= req.body

  try {
    const exist_user = await prisma.user.findUnique({
      where:{
        id: Number(id)
      }
    }); 

     if (!exist_user)
    return res.status(400).json({ message: "invalid  user" });

    //  compare if the password in the database is the same with the one the user inputed 
   const is_match = await bcrypt.compare(password, exist_user.password);

    // edge cases
    if (!is_match) return res.status(401).json({ message: "Password is Incorrect" });

     if (is_match) {
    // delete code from verification array
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { password },
    });
  }
  res.status(200).json({ message: "password changed successfuly" });

  } catch (error) {
    console.log("error occured: ", error.message);
    return res.status(500).json({ message: error.message });
  }

});

// Protected routes
authRouter.get("/me", authMiddleware,async (req,res)=>{

});

