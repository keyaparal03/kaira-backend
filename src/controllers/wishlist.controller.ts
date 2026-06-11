import Wishlist
from "../models/Wishlist";

export const getWishlist =
async(
 req:any,
 res:any
)=>{

 const wishlist =
 await Wishlist.findOne({
  user:req.user._id
 })
 .populate("products");

 res.json({
  success:true,
  data:wishlist
 });

};

export const addToWishlist =
async(
 req:any,
 res:any
)=>{

 const {
  productId
 } = req.body;

 let wishlist =
 await Wishlist.findOne({
  user:req.user._id
 });

 if(!wishlist){

  wishlist =
  await Wishlist.create({

   user:req.user._id,

   products:[
    productId
   ]

  });

 }else{

  const exists =
  wishlist.products.some(
   (id:any)=>
   id.toString()
   === productId
  );

  if(!exists){

   wishlist.products.push(
    productId
   );
  }

  await wishlist.save();

 }

 res.json({
  success:true,
  data:wishlist
 });

};

export const removeWishlistItem =
async(
 req:any,
 res:any
)=>{

 const wishlist =
 await Wishlist.findOne({
  user:req.user._id
 });

 if(!wishlist){

  return res.status(404)
  .json({
   message:
   "Wishlist not found"
  });

 }

 wishlist.products =
 wishlist.products.filter(
  (id:any)=>
  id.toString()
  !== req.params.id
 ) as any;

 await wishlist.save();

 res.json({
  success:true
 });

};