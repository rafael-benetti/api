import { google } from 'googleapis';
import AppError from '@shared/errors/app-error';
import Axios from 'axios';
import fcmConfig from '@config/fcm';
import { Promise } from 'bluebird';
import NotificationProvider from '../contracts/notification.provider';
import MessagePayload from '../contracts/dtos/message-payload.dto';

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';

class FCMProvider implements NotificationProvider {
  private client = Axios.create();

  async sendToTopic(
    messagePayload: MessagePayload,
  ): Promise<{ data: string; status: number }> {
    const accessToken = await this.getAccessToken();

    if (!accessToken) throw AppError.unknownError;

    const url =
      'https://fcm.googleapis.com/v1/projects/notifications-4e0e2/messages:send';

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/json',
    };

    const response = await this.client.post(
      url,
      {
        message: {
          topic: messagePayload.topic,
          notification: {
            title: messagePayload.title,
            body: messagePayload.body,
            sound: 'default',
          },
        },
      },
      { headers },
    );

    return {
      data: response.data,
      status: response.status,
    };
  }

  async sendToDevices(
    messagePayload: MessagePayload,
  ): Promise<{ data: string; status: number }[] | undefined> {
    const accessToken = await this.getAccessToken();

    if (!accessToken) throw AppError.unknownError;

    const url =
      'https://fcm.googleapis.com/v1/projects/notifications-4e0e2/messages:send'; // TODO: TROCAR NOME DO PROJETO

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/json',
    };

    if (!messagePayload.tokens) return undefined;

    const promises = messagePayload.tokens.map(async token => {
      const response = await this.client.post(
        url,
        {
          message: {
            token,
            notification: {
              title: messagePayload.title,
              body: messagePayload.body,
            },
          },
        },
        { headers },
      );

      return response;
    });

    const responses = await Promise.all(promises);

    const response = responses.map(response => {
      return {
        data: response.data,
        status: response.status,
      };
    });

    return response;
  }

  getAccessToken(): Promise<string | null | undefined> {
    return new Promise((resolve, reject) => {
      const client = new google.auth.JWT(
        fcmConfig.clientEmail,
        undefined,
        fcmConfig.privateKey,
        MESSAGING_SCOPE,
        undefined,
      );

      client.authorize((err, tokens) => {
        if (err) {
          reject(err);
        } else {
          resolve(tokens?.access_token);
        }
      });
    });
  }
}

export default FCMProvider;
