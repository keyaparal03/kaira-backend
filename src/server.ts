import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import connectDB from "./config/db";

connectDB();

const PORT =
  process.env.PORT || 3500;

app.listen(PORT, () => {

  console.log(
    `Server Running On Port ${PORT}`
  );

});