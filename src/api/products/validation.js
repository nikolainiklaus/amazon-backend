import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const productSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and should be a string!",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Description is a mandatory field and should be a string!",
    },
  },
  brand: {
    in: ["body"],
    isString: {
      errorMessage: "Brand is a mandatory field and should be a string!",
    },
  },
  price: {
    in: ["body"],
    isFloat: {
      errorMessage:
        "Price is a mandatory field and should be an integer greater 0!",
      options: {
        min: 0,
      },
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and should be a string!",
    },
  },
};

export const checkProductSchema = checkSchema(productSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());

  if (errors.isEmpty()) {
    next();
  } else
    next(
      next(
        createHttpError(400, "Errors during book validation", {
          errorsList: errors.array(),
        })
      )
    );
};
