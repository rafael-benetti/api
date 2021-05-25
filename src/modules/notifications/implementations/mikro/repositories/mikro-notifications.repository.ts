import NotificationsRepository from '@modules/notifications/contracts/repositories/notifications.repostory';
import MikroOrmProvider from '@providers/orm-provider/implementations/mikro/mikro-orm-provider';
import { inject, injectable } from 'tsyringe';
import CreateNotificationDto from '@modules/notifications/contracts/dtos/create-notification.dto';
import FindNotificationsDto from '@modules/notifications/contracts/dtos/find-notifications.dto';
import MikroNotification from '../entities/mikro-notification';
import Notification from '../../../contracts/entities/notification';
import NotificationMapper from '../mappers/notification.mapper';

@injectable()
class MikroNotificationsRepository implements NotificationsRepository {
  private repository = this.ormProvider.entityManager.getRepository(
    MikroNotification,
  );

  constructor(
    @inject('OrmProvider')
    private ormProvider: MikroOrmProvider,
  ) {}

  create(data: CreateNotificationDto): Notification {
    const mikroNotification = new MikroNotification(data);
    this.repository.persist(mikroNotification);
    return NotificationMapper.toApi(mikroNotification);
  }

  async find({
    userId,
    limit,
    offset,
  }: FindNotificationsDto): Promise<{
    notifications: Notification[];
    count: number;
  }> {
    const [notifications, count] = await this.repository.findAndCount(
      {
        receivers: userId,
      },
      {
        limit,
        offset,
        orderBy: {
          date: 'ASC',
        },
        fields: ['id', 'title', 'body', 'date', 'groupId', 'machineId'],
      },
    );

    return {
      notifications: notifications.map(notification =>
        NotificationMapper.toApi(notification),
      ),
      count,
    };
  }

  async count(userId: string): Promise<number> {
    const notificationsCount = await this.repository.count({
      receivers: userId,
      isRead: false,
    });

    return notificationsCount;
  }

  save(data: Notification): void {
    const notification = NotificationMapper.toOrm(data);
    this.repository.persist(notification);
  }
}

export default MikroNotificationsRepository;
