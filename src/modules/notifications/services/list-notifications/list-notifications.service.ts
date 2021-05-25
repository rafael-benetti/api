import Notification from '@modules/notifications/contracts/entities/notification';
import NotificationsRepository from '@modules/notifications/contracts/repositories/notifications.repostory';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  limit?: number;
  offset?: number;
}

@injectable()
class ListNotificationsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: NotificationsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    limit,
    offset,
  }: Request): Promise<{ notifications: Notification[]; count: number }> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const notifications = await this.notificationsRepository.find({
      userId: user.id,
      limit,
      offset,
    });

    notifications.notifications.forEach(notification => {
      notification.isRead = true;
      this.notificationsRepository.save(notification);
    });

    this.ormProvider.commit();

    return notifications;
  }
}

export default ListNotificationsService;
