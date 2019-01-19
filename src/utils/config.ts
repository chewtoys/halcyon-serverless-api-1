const config = {
    MONGODB: process.env.MONGODB,
    JWT_SECURITY_KEY: process.env.JWT_SECURITY_KEY,
    SEED_EMAIL_ADDRESS: process.env.SEED_EMAIL_ADDRESS,
    SEED_PASSWORD: process.env.SEED_PASSWORD,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: parseInt(process.env.EMAIL_PORT, 10),
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_NOREPLY: process.env.EMAIL_NOREPLY,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
};

export default config;
