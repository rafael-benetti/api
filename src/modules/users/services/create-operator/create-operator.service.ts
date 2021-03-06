import { randomBytes } from 'crypto';
import Role from '@modules/users/contracts/enums/role';
import Permissions from '@modules/users/contracts/models/permissions';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import validatePermissions from '@modules/users/utils/validate-permissions';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import MailProvider from '@providers/mail-provider/contracts/models/mail.provider';
import signUpEmailTemplate from '@providers/mail-provider/templates/sign-up-email-template';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import isInGroupUniverse from '@shared/utils/is-in-group-universe';
import { inject, injectable } from 'tsyringe';
import LogType from '@modules/logs/contracts/enums/log-type.enum';
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';

interface Request {
  userId: string;
  email: string;
  name: string;
  groupIds: string[];
  permissions: Permissions;
  phoneNumber?: string;
}

@injectable()
class CreateOperatorService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('HashProvider')
    private hashProvider: HashProvider,

    @inject('MailProvider')
    private mailProvider: MailProvider,

    @inject('LogsRepository')
    private logsRepository: LogsRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    email,
    name,
    groupIds,
    permissions,
    phoneNumber,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    const universe = await getGroupUniverse(user);

    if (
      !isInGroupUniverse({
        groups: groupIds,
        universe,
        method: 'UNION',
      })
    )
      throw AppError.authorizationError;

    if (user.role !== Role.OWNER && !user.permissions?.createOperators)
      throw AppError.authorizationError;

    if (
      !validatePermissions({
        for: 'OPERATOR',
        permissions,
      })
    )
      throw AppError.incorrectPermissionsForOperator;

    email = email.toLowerCase();

    const emailExists = await this.usersRepository.findOne({
      by: 'email',
      value: email,
    });

    if (emailExists) throw AppError.emailAlreadyUsed;

    const password = randomBytes(3).toString('hex');

    const operator = this.usersRepository.create({
      email,
      password: this.hashProvider.hash(password),
      name,
      role: Role.OPERATOR,
      groupIds,
      permissions,
      stock: {
        prizes: [],
        supplies: [],
      },
      phoneNumber,
      isActive: true,
      ownerId: user.ownerId || user.id,
    });

    const mailData = signUpEmailTemplate({
      receiverName: operator.name,
      receiverEmail: operator.email,
      password,
    });

    this.mailProvider.send({
      receiverName: operator.name,
      receiverEmail: operator.email,
      subject: mailData.subject,
      html: mailData.htmlBody,
      text: mailData.plainText,
    });

    this.logsRepository.create({
      createdBy: user.id,
      groupId: undefined,
      ownerId: user.ownerId || user.id,
      type: LogType.CREATE_OPERATOR,
      userId: operator.id,
    });

    await this.ormProvider.commit();

    return operator;
  }
}

export default CreateOperatorService;
