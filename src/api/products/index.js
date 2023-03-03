import Express from "express";
import createHttpError from "http-errors";
import {
  getProducts,
  getReviews,
  writeProducts,
  writeReviews,
} from "../../lib/fs-tools.js";
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

productsRouter.get("/:id", async (req, res, next) => {
  try {
    const allProducts = await getProducts();
    const product = allProducts.find((product) => product._id == req.params.id);
    if (product) {
      res.status(201).send(product);
    } else {
      next(createHttpError(404, "product not found"));
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
    const index = allProducts.findIndex(
      (product) => req.params.id == product._id
    );
    if (index !== -1) {
      const productToChange = allProducts[index];
      console.log("ptc", productToChange);
      const productAfterChange = {
        ...productToChange,
        ...req.body,
        updatedAt: new Date(),
      };

      allProducts[index] = productAfterChange;
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

productsRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const allReviews = await getReviews();
    const filteredReviews = allReviews.filter(
      (r) => r.productId == req.params.id
    );
    if (filteredReviews.length < 0 || !filteredReviews) {
      next(createHttpError(404, `no reviews found for this product`));
    } else {
      res.status(201).send(filteredReviews);
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.post("/:id/reviews/upload", async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await getProducts().then((products) =>
      products.find((p) => p._id == productId)
    );
    if (!product) {
      throw new BadRequestError(`Product with ID ${productId} not found`);
    }
    const review = {
      ...req.body,
      _id: uniqid(),
      productId: productId,
      createdAt: new Date(),
    };
    const reviews = await getReviews();
    console.log("reviews hree:", reviews);
    reviews.push(review);
    await writeReviews(reviews);

    res.status(201).send(review);
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
