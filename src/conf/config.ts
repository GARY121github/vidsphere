interface IConfig {
  MONGODB_URI: string;
  NEXTAUTH_SECRET: string;
  RESEND_API_KEY: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRE: string;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRE: string;
  DEPLOYMENT_URL: string;
  AUTH_GOOGLE_ID: string;
  AUTH_GOOGLE_SECRET: string;
}

const config: IConfig = {
  MONGODB_URI: process.env.MONGODB_URI || "",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE || "",
  DEPLOYMENT_URL: process.env.DEPLOYMENT_URL || "",
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID || "",
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET || "",
};

export default config;
