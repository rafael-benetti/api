declare namespace NodeJS {
  export interface ProcessEnv {
    APP_PORT: string;
    APP_ENVIRONMENT: string;
    MY_SQL_HOST: string;
    MY_SQL_PORT: string;
    MY_SQL_USER: string;
    MY_SQL_PASS: string;
    MY_SQL_DB: string;
  }
}
