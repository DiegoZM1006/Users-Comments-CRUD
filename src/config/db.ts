import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionString: string = process.env.MONGO_URL || "mongodb://localhost:27017/nodejs";

export const db = mongoose.connect(connectionString).then(() => {
    console.log("Connected to database");
}).catch((error) => {
    console.log(error);
    process.exit(1);
});