import Express from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { join } from "path";
const { readJSON, writeJSON, writeFile } = fs;

const rootPath = process.cwd();
const dataPath = join(rootPath, "./src/data");
const productsJSON = join(dataPath, "products.json");
const reviewsJSON = join(dataPath, "reviews.json");

export const getProducts = () => {
  return readJSON(productsJSON);
};

export const writeProducts = (allProducts) =>
  writeJSON(productsJSON, allProducts);

export const getReviews = () => readJSON(reviewsJSON);

export const writeReviews = (allReviews) => writeJSON(reviewsJSON, allReviews);
