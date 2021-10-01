"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const mail_provider_1 = __importDefault(require("./contracts/models/mail.provider"));
const nodemailer_mail_provider_1 = __importDefault(require("./implementations/nodemailer/nodemailer-mail.provider"));
tsyringe_1.container.registerSingleton('MailProvider', nodemailer_mail_provider_1.default);
