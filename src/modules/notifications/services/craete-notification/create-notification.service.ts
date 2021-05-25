import logger from '@config/logger';
import NotificationsRepository from '@modules/notifications/contracts/repositories/notifications.repostory';
import Role from '@modules/users/contracts/enums/role';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import NotificationProvider from '@providers/notification-provider/contracts/notification.provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import { Promise } from 'bluebird';
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
    let operator;
    const users = await this.usersRepository.find({
      filters: {
        groupIds: [groupId],
        role: Role.MANAGER,
      },
    });

    if (operatorId) {
      operator = await this.usersRepository.findOne({
        by: 'id',
        value: operatorId,
      });
    }

    let tokens = users
      .filter(user => user?.deviceToken !== undefined)
      .map(user => user.deviceToken) as string[];

    if (operator?.deviceToken) tokens = [...tokens, operator.deviceToken];

    const firebaseMessageInfos = await this.notificationProvider.sendToDevices({
      title,
      body,
      tokens,
    });

    logger.info(firebaseMessageInfos);

    const receivers = operator?.id
      ? [...users.map(user => user.id), operator.id]
      : users.map(user => user.id);

    this.notificationsRepository.create({
      body,
      title,
      groupId,
      receivers,
      machineId,
    });

    await this.ormProvider.commit();
  }
}
