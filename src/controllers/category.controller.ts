import { Request, Response }
from "express";

import Category
from "../models/Category";

export const createCategory =
async (
 req: Request,
 res: Response
) => {

 try {

  const {
   name,
   slug,
   description,
   image
  } = req.body;

  const exists =
  await Category.findOne({
   slug
  });

  if (exists) {

   return res.status(400)
   .json({
    success: false,
    message:
    "Category already exists"
   });

  }

  const category =
  await Category.create({

   name,

   slug,

   description,

   image

  });

  res.status(201).json({

   success: true,

   data: category

  });

 } catch (error) {

  res.status(500).json({

   success: false,

   message:
   "Failed to create category"

  });

 }

};

export const getCategories =
async (
 req: Request,
 res: Response
) => {

 try {

  const categories =
  await Category.find();

  res.json({

   success: true,

   data: categories

  });

 } catch {

  res.status(500).json({

   success: false,

   message:
   "Failed to fetch categories"

  });

 }

};

export const getCategoryById =
async (
 req: Request,
 res: Response
) => {

 try {

  const category =
  await Category.findById(
   req.params.id
  );

  if (!category) {

   return res.status(404)
   .json({

    success: false,

    message:
    "Category not found"

   });

  }

  res.json({

   success: true,

   data: category

  });

 } catch {

  res.status(500).json({

   success: false,

   message:
   "Failed to fetch category"

  });

 }

};

export const updateCategory =
async (
 req: Request,
 res: Response
) => {

 try {

  const category =
  await Category.findByIdAndUpdate(
   req.params.id,
   req.body,
   {
    new: true
   }
  );

  res.json({

   success: true,

   data: category

  });

 } catch {

  res.status(500).json({

   success: false,

   message:
   "Failed to update category"

  });

 }

};

export const deleteCategory =
async (
 req: Request,
 res: Response
) => {

 try {

  await Category.findByIdAndDelete(
   req.params.id
  );

  res.json({

   success: true,

   message:
   "Category deleted"

  });

 } catch {

  res.status(500).json({

   success: false,

   message:
   "Failed to delete category"

  });

 }

};