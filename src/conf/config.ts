interface IConfig {
    MONGODB_URI: string;
}

const config = {
    MONGODB_URI : process.env.MONGODB_URI || '', 
}

export default config;