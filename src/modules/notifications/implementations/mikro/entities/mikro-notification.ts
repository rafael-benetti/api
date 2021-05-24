import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import CreateNotificationDto from '@modules/notifications/contracts/dtos/create-notification.dto';
import Notification from '@modules/notifications/contracts/entities/notification';

@Entity({ collection: 'notifications' })
class MikroNotification implements Notification {
  @PrimaryKey({ name: '_id' })
  id: string;

  @Property()
  title: string;

  @Property()
  message: string;

  constructor(data?: CreateNotificationDto) {
    if (data) {
      this.title = data.title;
      this.message = data.title;
      this.title = data.title;
    }
  }
}

export default MikroNotification;
