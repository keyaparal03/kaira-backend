import Cart from "../models/Cart";

export const getCart =
async(
 req:any,
 res:any
)=>{

 const cart =
 await Cart.findOne({
  user:req.user._id
 })
 .populate(
  "items.product"
 );

 res.json({
  success:true,
  data:cart
 });

};

export const addToCart =
async(
 req:any,
 res:any
)=>{

 const {
  productId,
  quantity
 } = req.body;

 let cart =
 await Cart.findOne({
  user:req.user._id
 });

 if(!cart){

  cart =
  await Cart.create({

   user:req.user._id,

   items:[
    {
     product:productId,
     quantity
    }
   ]

  });

 }else{

  const existingItem =
  cart.items.find(
   (item:any)=>
   item.product.toString()
   === productId
  );

  if(existingItem){

   existingItem.quantity +=
   quantity;

  }else{

   cart.items.push({
    product:productId,
    quantity
   } as any);

  }

  await cart.save();

 }

 res.json({
  success:true,
  data:cart
 });

};

export const updateCartItem =
async(
 req:any,
 res:any
)=>{

 const {
  quantity
 } = req.body;

 const cart =
 await Cart.findOne({
  user:req.user._id
 });

 if(!cart){

  return res.status(404)
  .json({
   message:"Cart not found"
  });

 }

 const item =
 cart.items.find(
  (item:any)=>
  item._id.toString()
  === req.params.id
 );

 if(item){

  item.quantity =
  quantity;
 }

 await cart.save();

 res.json({
  success:true
 });

};

export const removeCartItem =
async(
 req:any,
 res:any
)=>{

 const cart =
 await Cart.findOne({
  user:req.user._id
 });

 if(!cart){

  return res.status(404)
  .json({
   message:"Cart not found"
  });

 }

 cart.items =
 cart.items.filter(
  (item:any)=>
  item._id.toString()
  !== req.params.id
 ) as any;

 await cart.save();

 res.json({
  success:true
 });

};