"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const app_error_1 = __importDefault(require("../../../shared/errors/app-error"));
const axios_1 = __importDefault(require("axios"));
const fcm_1 = __importDefault(require("../../../config/fcm"));
const bluebird_1 = require("bluebird");
const notification_provider_1 = __importDefault(require("../contracts/notification.provider"));
const message_payload_dto_1 = __importDefault(require("../contracts/dtos/message-payload.dto"));
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
class FCMProvider {
    constructor() {
        this.client = axios_1.default.create();
    }
    async sendToTopic(messagePayload) {
        const accessToken = await this.getAccessToken();
        if (!accessToken)
            throw app_error_1.default.unknownError;
        const url = 'https://fcm.googleapis.com/v1/projects/notifications-4e0e2/messages:send';
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/json',
        };
        const response = await this.client.post(url, {
            message: {
                topic: messagePayload.topic,
                notification: {
                    title: messagePayload.title,
                    body: messagePayload.body,
                    sound: 'default',
                },
            },
        }, { headers });
        return {
            data: response.data,
            status: response.status,
        };
    }
    async sendToDevices(messagePayload) {
        const accessToken = await this.getAccessToken();
        if (!accessToken)
            throw app_error_1.default.unknownError;
        const url = 'https://fcm.googleapis.com/v1/projects/notifications-4e0e2/messages:send'; // TODO: TROCAR NOME DO PROJETO
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/json',
        };
        if (!messagePayload.tokens)
            return undefined;
        const promises = messagePayload.tokens.map(async (token) => {
            const response = await this.client.post(url, {
                message: {
                    token,
                    notification: {
                        title: messagePayload.title,
                        body: messagePayload.body,
                    },
                },
            }, { headers });
            return response;
        });
        const responses = await bluebird_1.Promise.all(promises);
        const response = responses.map(response => {
            return {
                data: response.data,
                status: response.status,
            };
        });
        return response;
    }
    getAccessToken() {
        return new bluebird_1.Promise((resolve, reject) => {
            const client = new googleapis_1.google.auth.JWT(fcm_1.default.clientEmail, undefined, fcm_1.default.privateKey, MESSAGING_SCOPE, undefined);
            client.authorize((err, tokens) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(tokens?.access_token);
                }
            });
        });
    }
}
exports.default = FCMProvider;
