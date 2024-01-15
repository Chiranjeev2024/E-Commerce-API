import express from "express";
import swagger from "swagger-ui-express";
import ProductRouter from "./src/features/product/product.routes.js";
import bodyParser from "body-parser";
import UserRouter from "./src/features/user/user.routes.js";
//import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import CartRouter from "./src/features/cart/cart.route.js";

import apiDocs from "./swagger.json" assert { type: "json" };
const server = express();
const port = process.env.PORT || 3400;

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "null");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

// server.use((req, res, next) => {
//   console.log(req.url);
//   console.log("req header", req.headers);
//   next();
// });
//for parsing if data is sent in raw-json format
server.use(bodyParser.json());
// for parsing if data is sent in form-data format
// server.use(express.urlencoded({ extended: true }));

server.use("/api/cart", jwtAuth, CartRouter);

server.use("/api/users", UserRouter);

//for all requests realted to product, redirect to product rotue
//localhost:3400/api/product
server.use("/api/products", jwtAuth, ProductRouter);

//Defualt request handler
server.get("/", (req, res) => {
  res.send("Welcome to this project");
});

server.use((req, res) => {
  res
    .status(404)
    .send("API not found, refer to /api-docs for API documentation");
});

server.listen(port, () => {
  console.log(`Server has started at port ${port}`);
});
