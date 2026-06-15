import Order from "../models/Order";

import Cart from "../models/Cart";

/*
====================================
CREATE ORDER
====================================
*/

export const createOrder =
async(
 req:any,
 res:any
)=>{

 try{

  const {

   shippingAddress,

   city,

   state,

   postalCode,

   paymentMethod

  } = req.body;

  /*
  GET USER CART
  */

  const cart =
  await Cart.findOne({

   user:req.user._id

  })
  .populate(
   "items.product"
  );

  /*
  CHECK CART
  */

  if(
   !cart ||

   cart.items.length === 0
  ){

   return res
   .status(400)
   .json({

    message:
    "Cart is empty"

   });
  }

  /*
  CALCULATE TOTAL
  */

  const totalAmount =
  cart.items.reduce(

   (
    acc:number,
    item:any
   ) =>

    acc +

    (
     item.product.price *
     item.quantity
    ),

   0
  );

  /*
  CREATE ORDER
  */

  const order =
  await Order.create({

   user:
   req.user._id,

   orderItems:
   cart.items.map(
    (item:any)=>({

     product:
     item.product._id,

     quantity:
     item.quantity,

     price:
     item.product.price

    })
   ),

   shippingAddress:{

    address:
    shippingAddress,

    city,

    state,

    postalCode

   },

   paymentMethod,

   totalAmount,

   status:
   "paid"
  });

  /*
  CLEAR CART
  IMPORTANT
  */

  cart.items = [];

  await cart.save();

  /*
  RESPONSE
  */

  res.status(201)
  .json({

   success:true,

   message:
   "Order placed successfully",

   data:order

  });

 }catch(error){

  console.log(
   error
  );

  res.status(500)
  .json({

   message:
   "Server Error"

  });
 }
};