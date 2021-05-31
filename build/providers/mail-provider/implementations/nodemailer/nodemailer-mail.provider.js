"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("../../../../config/mail"));
const nodemailer_1 = require("nodemailer");
const send_mail_dto_1 = __importDefault(require("../../contracts/dtos/send-mail.dto"));
const mail_provider_1 = __importDefault(require("../../contracts/models/mail.provider"));
class NodemailerMailProvider {
    constructor() {
        this.transporter = nodemailer_1.createTransport({
            host: mail_1.default.host,
            port: mail_1.default.port,
            auth: {
                user: mail_1.default.user,
                pass: mail_1.default.pass,
            },
        });
    }
    send(data) {
        this.transporter.sendMail({
            from: {
                name: 'Equipe Sttigma',
                address: mail_1.default.user,
            },
            to: {
                name: data.receiverName,
                address: data.receiverEmail,
            },
            subject: data.subject,
            html: data.html,
            text: data.text,
        });
    }
}
exports.default = NodemailerMailProvider;
