import logger from '@config/logger';
import NotificationsRepository from '@modules/notifications/contracts/repositories/notifications.repostory';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import NotificationProvider from '@providers/notification-provider/contracts/notification.provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import { token } from 'morgan';
import { inject, injectable } from 'tsyringe';

interface Request {
  machineId?: string;
  operatorId?: string;
  groupId: string;
  title: string;
  body: string;
}

@injectable()
export default class CreateNotificationService {
  constructor(
    @inject('OrmProvider')
    private ormProvider: OrmProvider,

    @inject('NotificationProvider')
    private notificationProvider: NotificationProvider,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: NotificationsRepository,
  ) {}

  async execute({
    body,
    title,
    groupId,
    machineId,
    operatorId,
  }: Request): Promise<void> {
    const users = await this.usersRepository.find({
      filters: {
        groupIds: [groupId],
      },
    });

    const tokens = users
      .filter(user => user?.deviceToken !== undefined)
      .map(user => user.deviceToken) as string[];

    logger.info(tokens);

    const firebaseMessageInfo = await this.notificationProvider.sendToDevices({
      title,
      body,
      tokens,
    });

    // this.notificationsRepository.create({
    //   body,
    //   title,
    //   groupId,
    //   receivers,
    //   machineId,
    // });

    await this.ormProvider.commit();
  }
}
