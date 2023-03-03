import Express from "express";
import {
  badRequestHandler,
  unauthorizedHandler,
  notfoundHandler,
  genericErrorHandler,
} from "./src/errorsHandler.js";
import productsRouter from "./src/api/products/index.js";

const server = Express();
const port = 3002;

server.use(Express.json());

server.use("/products", productsRouter);

server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(notfoundHandler); // 404
server.use(genericErrorHandler); // 500

server.listen(port, () => {
  console.log("server running adsfaal on:", port);
});
