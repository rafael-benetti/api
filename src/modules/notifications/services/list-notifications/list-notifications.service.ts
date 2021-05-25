// import Notification from '@modules/notifications/contracts/entities/notification';
// import NotificationsRepository from '@modules/notifications/contracts/repositories/notifications.repostory';
// import Role from '@modules/users/contracts/enums/role';
// import UsersRepository from '@modules/users/contracts/repositories/users.repository';
// import AppError from '@shared/errors/app-error';
// import { inject, injectable } from 'tsyringe';
//
// interface Request {
//   userId: string;
//   limit?: number;
//   offset?: number;
// }
//
// @injectable()
// class ListNotificationsService {
//   constructor(
//     @inject('UsersRepository')
//     private usersRepository: UsersRepository,
//
//     @inject('NotificationsRepository')
//     private notificationsRepository: NotificationsRepository,
//   ) {}
//
//   async execute({ userId, limit, offset }: Request): Promise<Notification[]> {
//     const user = await this.usersRepository.findOne({
//       by: 'id',
//       value: userId,
//     });
//
//     if (!user) throw AppError.userNotFound;
//
//     //if (user.role === Role.OPERATOR) {
//     //  if (user.groupIds) {
//     //    const notifications = await this.notificationsRepository.find({
//     //      topic: user.groupIds,
//     //      limit,
//     //      offset,
//     //    });
// //
//         return notifications;
//       }
//     //}
//
//     if (user.role === Role.MANAGER || user.role === Role.OWNER) {
//       const notifications = await this.notificationsRepository.find({
//         topic: user.id,
//         limit,
//         offset,
//       });
//       return notifications;
//     }
//
//     return [];
//   }
// }
//
// export default ListNotificationsService;
//
