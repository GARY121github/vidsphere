import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/db/connectDB";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import config from "@/conf/config";
import Google from "next-auth/providers/google";
import signInSchema from "@/schemas/signIn.schema";
import ApiError from "@/utils/ApiError";

const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: config.AUTH_GOOGLE_ID,
      clientSecret: config.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials): Promise<any> {
        await connectDB();
        try {
          const isValidData = signInSchema.safeParse(credentials);

          if (!isValidData.success) {
            const errorMessage: string = isValidData.error.errors
              .map((error) => `${error.path.join(".")} ${error.message}`)
              .join(". ");
            throw new Error("Please provide valid data. " + errorMessage);
          }

          const user = await UserModel.findOne({
            $or: [
              {
                username: isValidData.data.username,
              },
            ],
          });

          if (!user) {
            throw new ApiError(404, "User not found!!");
          }

          if (!user.isVerified) {
            throw new ApiError(400, "Please verify your email first!!");
          }

          const isValid = await bcrypt.compare(
            isValidData.data.password,
            user.password
          );

          if (!isValid) {
            throw new ApiError(400, "Invalid credentials!!");
          }

          return user;
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();
        try {
          const { id, email, image } = user;
          const existingUser = await UserModel.findOne({ email });
          let userData;

          if (existingUser) {
            if (!existingUser.googleId) {
              const updatedUser = await UserModel.findOneAndUpdate(
                { email },
                { $set: { googleId: id, avatar: image } },
                { new: true }
              );
              userData = updatedUser;
            } else {
              userData = existingUser;
            }
          }

          if (!existingUser) {
            const newUser = await UserModel.create({
              username: email?.split("@")[0],
              fullName: user.name,
              email,
              avatar: image,
              googleId: id,
              isVerified: true,
            });

            if (!newUser) {
              throw new ApiError(400, "Error signing in with Google!!");
            }

            userData = newUser;
          }

          //updating user
          user._id = userData?._id?.toString();
          user.username = userData?.username;

          return true;
        } catch (error) {
          console.error("Error signing in with Google: ", error);
          throw new Error("Error signing in with Google!!");
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token.user._id;
        session.user.username = token.user.username;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: config.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};

export default authOptions;
