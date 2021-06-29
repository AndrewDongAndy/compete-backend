declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    DATABASE_URI: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    PORT: string;

    // email-related
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;

    SERVICE_CLIENT_ID: string;
    PRIVATE_KEY: string;

    MY_EMAIL: string;

    // REDIS_URL: string;
    // REDIS_TLS_URL: string; // not used
  }
}
