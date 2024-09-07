import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

interface WatchHistoryItem {
  type: Types.ObjectId;
  ref: "Video";
}

export interface User extends Document {
  username: string;
  email: string;
  fullName: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  avatar?: string;
  coverImage?: string;
  refreshToken?: string;
  watchHistory?: WatchHistoryItem[];
  googleId?: string;
}

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      index: true,
      lowercase: true,
    },
    avatar: {
      type: String, // AWS url
      default:
        "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg",
    },
    coverImage: {
      type: String, // AWS url
      default: "https://tokystorage.s3.amazonaws.com/images/default-cover.png",
    },
    password: {
      type: String,
      trim: true,
      minlength: [6, "Password must be at least 6 characters long"],
      maxlength: [100, "Password must be at most 100 characters long"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
