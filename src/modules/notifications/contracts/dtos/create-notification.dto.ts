export default interface CreateNotificationDto {
  title: string;
  body: string;
  topic: string;
  type: string;
  firebaseMessageInfo: { data: string; status: number };
}
