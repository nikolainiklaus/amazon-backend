import Express from "express";
import createHttpError from "http-errors";
import { getProducts, writeProducts } from "../../lib/fs-tools.js";
import uniqid from "uniqid";
import { checkProductSchema, triggerBadRequest } from "./validation.js";

const productsRouter = Express.Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    const allProducts = await getProducts();
    if (allProducts.length > 0) {
      res.send(allProducts);
    } else {
      next(createHttpError(404, "No products found"));
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.post(
  "/",
  checkProductSchema,
  triggerBadRequest,
  async (req, res, next) => {
    console.log("post triggered");
    try {
      const allProducts = await getProducts();
      const newProduct = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: uniqid(),
      };
      allProducts.push(newProduct);
      writeProducts(allProducts);
      res.status(201).send(newProduct);
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.put("/:id", async (req, res, next) => {
  try {
    const allProducts = await getProducts();
    const productToChange = allProducts.find(
      (product) => req.params.id == product._id
    );
    if (productToChange) {
      console.log("ptc", productToChange);
      const productAfterChange = {
        ...productToChange,
        ...req.body,
        updatedAt: new Date(),
      };

      allProducts.push(productAfterChange);
      writeProducts(allProducts);
      res.status(201).send(productAfterChange);
    } else {
      next(createHttpError(404, `Book with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const allProducts = await getProducts();
    const remainingProducts = allProducts.filter(
      (product) => product._id !== req.params.id
    );
    if (remainingProducts.length !== allProducts.length) {
      writeProducts(remainingProducts);
      res.status(204).send(remainingProducts);
    } else {
      next(createHttpError(404, `Book with this ${req.params.id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
