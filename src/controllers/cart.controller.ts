import Cart from "../models/Cart";

/*
========================================
GET CART
========================================
*/

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

/*
========================================
ADD TO CART
========================================
*/

export const addToCart =
async(
 req:any,
 res:any
)=>{

 try{

  const {
   productId,
   quantity
  } = req.body;

  /*
  MAX QUANTITY
  */

  if(quantity > 10){

   return res
   .status(400)
   .json({

    message:
    "Maximum quantity is 10"

   });
  }

  let cart =
  await Cart.findOne({

   user:req.user._id

  });

  /*
  CREATE NEW CART
  */

  if(!cart){

   cart =
   await Cart.create({

    user:req.user._id,

    items:[
     {
      product:
      productId,

      quantity
     }
    ]

   });

  }else{

   /*
   CHECK EXISTING
   */

   const existingItem =
   cart.items.find(
    (item:any)=>

    item.product
    .toString() ===
    productId
   );

   if(existingItem){

    const newQty =
    existingItem.quantity +
    quantity;

    if(newQty > 10){

     return res
     .status(400)
     .json({

      message:
      "Maximum quantity is 10"

     });
    }

    existingItem.quantity =
    newQty;

   }else{

    cart.items.push({

     product:productId,

     quantity

    } as any);
   }

   await cart.save();
  }

  /*
  IMPORTANT
  REFETCH POPULATED
  */

  const updatedCart =
  await Cart.findOne({

   user:req.user._id

  })
  .populate(
   "items.product"
  );

  res.json({

   success:true,

   data:updatedCart

  });

 }catch(error){

  res.status(500)
  .json({

   message:
   "Server Error"

  });
 }
};

/*
========================================
UPDATE QUANTITY
========================================
*/

export const updateCartItem =
async(
 req:any,
 res:any
)=>{

 try{

  const {
   quantity
  } = req.body;

  const cart =
  await Cart.findOne({

   user:req.user._id

  });

  if(!cart){

   return res
   .status(404)
   .json({

    message:
    "Cart not found"

   });
  }

  /*
  FIND ITEM
  */

  const item =
  cart.items.find(
   (item:any)=>

   item._id.toString()
   === req.params.id
  );

  /*
  REMOVE IF ZERO
  */

  if(quantity <= 0){

   cart.items =
   cart.items.filter(
    (item:any)=>

    item._id.toString()
    !== req.params.id
   ) as any;

  }else{

   /*
   MAX 10
   */

   if(quantity > 10){

    return res
    .status(400)
    .json({

     message:
     "Maximum quantity is 10"

    });
   }

   if(item){

    item.quantity =
    quantity;
   }
  }

  await cart.save();

  /*
  REFETCH UPDATED
  */

  const updatedCart =
  await Cart.findOne({

   user:req.user._id

  })
  .populate(
   "items.product"
  );

  res.json({

   success:true,

   data:updatedCart

  });

 }catch(error){

  res.status(500)
  .json({

   message:
   "Server Error"

  });
 }
};

/*
========================================
REMOVE ITEM
========================================
*/

export const removeCartItem =
async(
 req:any,
 res:any
)=>{

 try{

  const cart =
  await Cart.findOne({

   user:req.user._id

  });

  if(!cart){

   return res
   .status(404)
   .json({

    message:
    "Cart not found"

   });
  }

  /*
  REMOVE
  */

  cart.items =
  cart.items.filter(
   (item:any)=>

   item._id.toString()
   !== req.params.id

  ) as any;

  await cart.save();

  /*
  REFETCH UPDATED
  */

  const updatedCart =
  await Cart.findOne({

   user:req.user._id

  })
  .populate(
   "items.product"
  );

  res.json({

   success:true,

   data:updatedCart

  });

 }catch(error){

  res.status(500)
  .json({

   message:
   "Server Error"

  });
 }
};