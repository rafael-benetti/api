import NotificationsRepository from '@modules/notifications/contracts/repositories/notifications.repostory';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';

@injectable()
class GetNumberOfUnreadNotificationsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: NotificationsRepository,
  ) {}

  async execute(
    userId: string,
  ): Promise<{ numberOfUnreadNotifications: number }> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const count = await this.notificationsRepository.count(user.id);

    return { numberOfUnreadNotifications: count };
  }
}

export default GetNumberOfUnreadNotificationsService;
