import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/db/connectDB";
import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import config from "@/conf/config";
import Google from "next-auth/providers/google";

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
      async authorize(credentials: any): Promise<any> {
        await connectDB();
        try {
          const user = await UserModel.findOne({
            $or: [
              {
                username: credentials.username,
              },
            ],
          });

          console.log(user);

          if (!user) {
            throw new Error("No user found");
          }

          // console.log(credentials.password);
          // console.log(user.password);

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // console.log(isValid);

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return user;
        } catch (error: any) {
          console.log("Error :: ", error);
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
              throw new Error("Failed to create user!!");
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
};

export default authOptions;
