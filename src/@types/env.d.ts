declare namespace NodeJS {
  export interface ProcessEnv {
    APP_PORT: string;
    APP_ENVIRONMENT: string;

    MONGO_URL: string;

    REDIS_TTL: string;

    S3_BUCKET: string;
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;

    MAIL_HOST: string;
    MAIL_PORT: number;
    MAIL_SECURE: boolean;
    MAIL_USER: string;
    MAIL_PASSWORD: string;

    FCM_SERVER_KEY: string;
  }
}
