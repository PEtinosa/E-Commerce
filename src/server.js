import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorhandler.js";

import {swaggerSetup} from "./config/swagger.js"
dotenv.config();
// console.log(process.env);

// Import Routes
import { authRouter } from "./routes/authRoute.js";
import { productRouter } from "./routes/prouductRoute.js";
import { cartRouter } from "./routes/cart.js";
import { userRouter } from "./routes/users.js";

const app = express();

app.use (cors({
    origin: "htttp://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended:true}));
swaggerSetup(app);

// API ROUTES
app.use("/auth", authRouter)
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/users", userRouter);

app.use(logger);
app.use(errorHandler);
app.listen(5001, ()=>console.log("server started at port:", 5001))
/*this is saying that the server should listen at this port
and callback "server started at port" so I know its working*/ 