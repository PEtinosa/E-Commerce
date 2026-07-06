import express from "express";


// Import Routes
import { productRouter } from "./routes/prouductRoute.js";

const app = express();

// API ROUTES
app.use("/products", productRouter);

app.listen(5001, ()=>console.log("server started at port:", 5001))
/*this is sayinf that the server should listen at this port
and callback "server started at port" so I know its working*/ 