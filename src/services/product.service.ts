import Product from "../models/Product";

export const findProducts = async (
  query: any,
  page: number,
  limit: number,
  sort: any
) => {

  const products =
    await Product.find(query)
      .populate("category")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

  const total =
    await Product.countDocuments(
      query
    );

  return {
    products,
    total
  };
};