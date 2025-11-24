import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(() => {
    console.log("Connected OK");
    process.exit(0);
  })
  .catch((err) => {
    console.log("Connection FAIL");
    console.error(err);
    process.exit(1);
  });
