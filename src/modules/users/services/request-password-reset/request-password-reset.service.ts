import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import MailProvider from '@providers/mail-provider/contracts/models/mail.provider';
import requestPasswordResetTemplate from '@providers/mail-provider/templates/request-password-reset-template';
import SessionProvider from '@providers/session-provider/contracts/models/session.provider';
import { inject, injectable } from 'tsyringe';

interface Request {
  email: string;
}

@injectable()
class RequestPasswordResetService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MailProvider')
    private mailProvider: MailProvider,

    @inject('SessionProvider')
    private sessionProvider: SessionProvider,
  ) {}

  async execute({ email }: Request): Promise<void> {
    const user = await this.usersRepository.findOne({
      by: 'email',
      value: email,
    });

    if (user) {
      const token = await this.sessionProvider.createPasswordResetToken(
        user.id,
      );

      const emailTemplate = requestPasswordResetTemplate({
        receiverName: user.name,
        resetPasswordLink: `https://app.sttigma.com/email-confirmado?token=${token}`,
      });

      this.mailProvider.send({
        receiverName: user.name,
        receiverEmail: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.htmlBody,
        text: emailTemplate.plainText,
      });
    }
  }
}

export default RequestPasswordResetService;
