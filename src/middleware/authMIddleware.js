import { configDotenv } from "dotenv";
configDotenv();
import jwt from "jsonwebtoken";

// generate jwt: payload (userId)
export const generate_jwt = async (payload) => {
  const token = await jwt.sign(payload, process.env["JWT_SECRET"], {
    expiresIn: "1d",
  });
  return token;
};

// verify jwt
export const verify_jwt = async (token) => {
  const verified_user = await jwt.verify(token, process.env["JWT_SECRET"]);
  return verified_user;
};

// auth middleware

export const authMiddleware = async (req, res, next) => {
  try {
    
    // check for token
    // console.log(req.headers);
    const token = req.headers.authorization?.split(" ")[1];
    
    // console.log("token:", token);
    if (!token) return res.status(401).json({ message: "access denied"});
  
    // verify token
    const verified_user = await verify_jwt(token);
    req.user = verified_user;
    next();
  } catch (error) {
    return res.status(401).json({message: "Invalid or expired token."});
  }
};