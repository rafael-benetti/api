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
  receivers: string[];

  @Property()
  machineId?: string;

  @Property()
  body: string;

  @Property()
  groupId: string;

  constructor(data?: CreateNotificationDto) {
    if (data) {
      this.title = data.title;
      this.body = data.body;
      this.groupId = data.groupId;
      this.receivers = data.receivers;
      this.machineId = data.machineId;
    }
  }
}

export default MikroNotification;
