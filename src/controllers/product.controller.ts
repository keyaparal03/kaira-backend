import {
 Request,
 Response
}
from "express";

import Product
from "../models/Product";

export const createProduct =
async (
 req: Request,
 res: Response
) => {

 try {

  const product =
  await Product.create(
   req.body
  );

  res.status(201).json({

   success: true,

   data: product

  });

 } catch {

  res.status(500).json({

   success: false,

   message:
   "Failed to create product"

  });

 }

};

export const getProducts =
async (
 req: Request,
 res: Response
) => {

 try {

  const page =
  Number(
   req.query.page
  ) || 1;

  const limit =
  Number(
   req.query.limit
  ) || 10;

  const search =
  String(
   req.query.search || ""
  );

  const category =
  String(
   req.query.category || ""
  );

  const sort =
  String(
   req.query.sort || ""
  );

  const query: any = {
   isActive: true
  };

  if (search) {

   query.name = {

    $regex: search,

    $options: "i"

   };

  }

  if (category) {

   query.category =
   category;

  }

  let productsQuery =
  Product.find(query)
  .populate("category");

  if (sort === "asc") {

   productsQuery =
   productsQuery.sort({
    price: 1
   });

  }

  if (sort === "desc") {

   productsQuery =
   productsQuery.sort({
    price: -1
   });

  }

  const products =
  await productsQuery
  .skip(
   (page - 1) * limit
  )
  .limit(limit);

  const total =
  await Product.countDocuments(
   query
  );

  res.json({

   success: true,

   data: products,

   page,

   total,

   totalPages:
   Math.ceil(
    total / limit
   )

  });

 } catch {

  res.status(500).json({

   success: false,

   message:
   "Failed to fetch products"

  });

 }

};

export const getProductById =
async (
 req: Request,
 res: Response
) => {

 try {

  const product =
  await Product.findById(
   req.params.id
  )
  .populate("category");

  if (!product) {

   return res.status(404)
   .json({

    success: false,

    message:
    "Product not found"

   });

  }

  res.json({

   success: true,

   data: product

  });

 } catch {

  res.status(500).json({

   success: false,

   message:
   "Failed to fetch product"

  });

 }

};

export const updateProduct =
async (
 req: Request,
 res: Response
) => {

 try {

  const product =
  await Product.findByIdAndUpdate(
   req.params.id,
   req.body,
   {
    new: true
   }
  );

  res.json({

   success: true,

   data: product

  });

 } catch {

  res.status(500).json({

   success: false,

   message:
   "Failed to update product"

  });

 }

};

export const deleteProduct =
async (
 req: Request,
 res: Response
) => {

 try {

  await Product.findByIdAndDelete(
   req.params.id
  );

  res.json({

   success: true,

   message:
   "Product deleted"

  });

 } catch {

  res.status(500).json({

   success: false,

   message:
   "Failed to delete product"

  });

 }

};