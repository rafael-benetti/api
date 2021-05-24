import MessagePayload from './dtos/message-payload.dto';

interface NotificationProvider {
  sendToTopic(
    messagePayload: MessagePayload,
  ): Promise<{ data: string; status: number }>;

  sendToDevices(
    messagePayload: MessagePayload,
  ): Promise<{ data: string; status: number }>;
}

export default NotificationProvider;
