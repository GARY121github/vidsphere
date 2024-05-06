import mongoose, { Document, Schema } from "mongoose";

interface User extends Document {
    username: string;
    email: string;
    fullName: string;
    password: string;
    avatar?: string;
    coverImage?: string;
    refreshToken?: string;
    watchHistory?: [
        {
            type: Schema.Types.ObjectId,       
            ref : "Video";
        }
    ];
}

const userSchema = new Schema<User>(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "Username is required"],
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
            trim: true,
        },
        fullName: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            index: true,
            lowercase: true
        },
        avatar: {
            type: String, // cloudinary url
            default: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg"
        },
        coverImage: {
            type: String, // cloudinary url
            default: "https://tokystorage.s3.amazonaws.com/images/default-cover.png"
        },
        password: {
            type: String,
            require: [true, "Password is required"]
        },
        refreshToken: {
            type: String
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Video'
            }
        ]
    },
    {
        timestamps: true
    }
)


const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema);

export default UserModel;