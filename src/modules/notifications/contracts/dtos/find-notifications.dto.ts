export default interface FindNotificationsDto {
  topic: string | string[];
  limit?: number;
  offset?: number;
}
