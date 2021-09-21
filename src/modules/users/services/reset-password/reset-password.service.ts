import { randomBytes } from 'crypto';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import MailProvider from '@providers/mail-provider/contracts/models/mail.provider';
import SessionProvider from '@providers/session-provider/contracts/models/session.provider';
import AppError from '@shared/errors/app-error';
import { inject, injectable } from 'tsyringe';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';

interface Request {
  resetPasswordToken: string;
}

@injectable()
class ResertPasswordService {
  constructor(
    @inject('SessionProvider')
    private sessionProvider: SessionProvider,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('MailProvider')
    private mailProvider: MailProvider,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({ resetPasswordToken }: Request): Promise<void> {
    const userId = await this.sessionProvider.getPasswordResetTokenOwner(
      resetPasswordToken,
    );

    if (!userId) throw AppError.invalidToken;

    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const password = randomBytes(3).toString('hex');

    user.password = this.hashProvider.hash(password);
    this.usersRepository.save(user);

    this.mailProvider.send({
      receiverName: user.name,
      receiverEmail: user.email,
      subject: 'Sua nova senha Black Telemetry está aqui',
      html: `<p>Sua nova senha: ${password}</p>`,
      text: `Sua nova senha: ${password}`,
    });

    await this.ormProvider.commit();
  }
}

export default ResertPasswordService;
