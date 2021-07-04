declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;

    ACCESS_TOKEN_SECRET: string;
    DATABASE_URI: string;
    REFRESH_TOKEN_SECRET: string;
    PORT: string;

    REDIS_URL: string;
    // REDIS_TLS_URL: string; // not used

    // email-related
    // user: string;
    // clientId: string;
    // clientSecret: string;
    // refreshToken: string;

    // SERVICE_CLIENT_ID: string;
    // PRIVATE_KEY: string;

    // MY_EMAIL: string;
  }
}
