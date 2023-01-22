import mongoose from "mongoose";

mongoose.set("strictQuery", true);

function connectToMongo() {
  try {
    mongoose.connect("mongodb://localhost:27017/nodeAndTS");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
}

connectToMongo();

export default mongoose;
