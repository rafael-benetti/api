export default class Notification {
  id: string;

  title: string;

  body: string;

  receivers: string[];

  machineId?: string;

  groupId: string;

  date: Date;

  isRead: boolean;
}
