interface IConfig {
    MONGODB_URI: string;
    NEXTAUTH_SECRET: string;
}

const config = {
    MONGODB_URI : process.env.MONGODB_URI || '', 
    NEXTAUTH_SECRET : process.env.NEXTAUTH_SECRET || ''
}

export default config;