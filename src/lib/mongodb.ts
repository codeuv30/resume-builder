import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        const URI = process.env.MONGO_URI;

        if(!URI) throw new Error("MONGO_URI is not defined in environment variables");

        await mongoose.connect(URI);

        console.log("MongoDB connected");
    } catch (error) {
        console.log("error in connecting to mongodb", error);
    }
}