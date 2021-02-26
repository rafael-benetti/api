declare namespace NodeJS {
  export interface ProcessEnv {
    APP_PORT: string;
    APP_ENVIRONMENT: string;
    MONGO_URL: string;
  }
}
