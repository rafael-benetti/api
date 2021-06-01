export default interface CreateNotificationDto {
  title: string;
  body: string;
  receivers: string[];
  machineId?: string;
  groupId: string;
}
