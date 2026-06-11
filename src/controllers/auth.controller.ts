import bcrypt from "bcryptjs";

import User from "../models/User";

import {
  generateAccessToken,
  generateRefreshToken
}
from "../utils/jwt";

export const register =
async (
 req: any,
 res: any
) => {

 try {

  const {
   name,
   email,
   password
  } = req.body;

  const userExists =
  await User.findOne({
   email
  });

  if(userExists){

   return res
   .status(400)
   .json({
    message:
    "User already exists"
   });

  }

  const hashedPassword =
  await bcrypt.hash(
   password,
   10
  );

  const user =
  await User.create({

   name,

   email,

   password:
   hashedPassword

  });

  res.status(201).json({
   success:true,
   user
  });

 } catch(error){

  res.status(500).json({
   message:"Server Error"
  });

 }

};

export const login =
async (
 req:any,
 res:any
)=>{

 try{

  const {
   email,
   password
  } = req.body;

  const user:any =
  await User.findOne({
   email
  });

  if(!user){

   return res.status(401)
   .json({
    message:
    "Invalid Email"
   });

  }

  const match =
  await bcrypt.compare(
   password,
   user.password
  );

  if(!match){

   return res.status(401)
   .json({
    message:
    "Invalid Password"
   });

  }

  const accessToken =
  generateAccessToken(
   user._id.toString()
  );

  const refreshToken =
  generateRefreshToken(
   user._id.toString()
  );

  user.refreshToken =
  refreshToken;

  await user.save();

  res.cookie(
   "refreshToken",
   refreshToken,
   {
    httpOnly:true,
    secure:false,
    sameSite:"lax"
   }
  );

  res.json({

   accessToken,

   user:{
    id:user._id,
    name:user.name,
    email:user.email,
    role:user.role
   }

  });

 }catch(error){

  res.status(500).json({
   message:
   "Server Error"
  });

 }

};

export const refreshToken =
async(
 req:any,
 res:any
)=>{

 const token =
 req.cookies.refreshToken;

 if(!token){

  return res.status(401)
  .json({
   message:
   "No Refresh Token"
  });

 }

 try{

  const jwt =
  require("jsonwebtoken");

  const decoded:any =
  jwt.verify(
   token,
   process.env
   .JWT_REFRESH_SECRET
  );

  const accessToken =
  generateAccessToken(
   decoded.id
  );

  res.json({
   accessToken
  });

 }catch{

  res.status(403)
  .json({
   message:
   "Invalid Token"
  });

 }

};