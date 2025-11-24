import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
console.log("URI:", uri);

mongoose.connect(uri)
    .then(() => {
        console.log("OK: Mongo connected");
        process.exit(0);
    })
    .catch(err => {
        console.error("FAIL:", err);
        process.exit(1);
    });
