import CreateNotificationDto from '../dtos/create-notification.dto';
import FindNotificationsDto from '../dtos/find-notifications.dto';
import Notification from '../entities/notification';

export default interface NotificationsRepository {
  create(data: CreateNotificationDto): Notification | undefined;
  find(
    data: FindNotificationsDto,
  ): Promise<{ notifications: Notification[]; count: number }>;
  count(userId: string): Promise<number>;
  save(data: Notification): void;
}
