import mongoose from "mongoose";
import config from "@/conf/config";

type ConnectionObject = {
    isConnected ?: number;
}

const connection : ConnectionObject = {};

const connectDB = async () : Promise<void> => {
    if(connection.isConnected){
        console.log("Already connected to DB");
        return;
    }

    try {
        const db = await mongoose.connect(config.MONGODB_URI || '' , {});
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error connecting to DB" , error);
        process.exit(1);
    }
}

export default connectDB;