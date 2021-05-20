import MikroNotification from '../entities/mikro-notification';
import Notification from '../../../contracts/entities/notification';

abstract class NotificationMapper {
  static toApi(data: MikroNotification): Notification {
    const notification = new Notification();
    Object.assign(notification, data);
    return notification;
  }

  static toOrm(data: Notification): MikroNotification {
    const notification = new MikroNotification();
    Object.assign(notification, data);
    return notification;
  }
}

export default NotificationMapper;
