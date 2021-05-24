export default interface FindNotificationsDto {
  topic: string | string[];
  userId: string;
  limit?: number;
  offset?: number;
}
