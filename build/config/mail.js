"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailConfig = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
};
exports.default = mailConfig;
