import express from "express";
import cors from "cors";

// Import Routes
import { productRouter } from "./routes/prouductRoute.js";
import { cartRouter } from "./routes/cart.js";
import { userRouter } from "./routes/users.js";

const app = express();

// API ROUTES
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/users", userRouter);

app.listen(5001, ()=>console.log("server started at port:", 5001))
/*this is saying that the server should listen at this port
and callback "server started at port" so I know its working*/ 