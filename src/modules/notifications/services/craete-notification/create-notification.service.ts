import NotificationsRepository from '@modules/notifications/contracts/repositories/notifications.repostory';
import NotificationProvider from '@providers/notification-provider/contracts/notification.provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import { inject, injectable } from 'tsyringe';

interface Request {
  machineId: string;
  title: string;
  body: string;
  topic: string;
  type: string;
}

@injectable()
export default class CreateNotificationService {
  constructor(
    @inject('OrmProvider')
    private ormProvider: OrmProvider,

    @inject('NotificationProvider')
    private notificationProvider: NotificationProvider,

    @inject('NotificationsRepository')
    private notificationsRepository: NotificationsRepository,
  ) {}

  async execute({ body, title, topic, type }: Request): Promise<void> {
    const firebaseMessageInfo = await this.notificationProvider.sendToTopic({
      topic,
      title,
      body,
    });

    this.notificationsRepository.create({
      body,
      title,
      topic,
      type,
      firebaseMessageInfo,
    });

    await this.ormProvider.commit();
  }
}
