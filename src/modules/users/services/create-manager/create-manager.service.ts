import { randomBytes } from 'crypto';
import Role from '@modules/users/contracts/enums/role';
import Permissions from '@modules/users/contracts/models/permissions';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import validatePermissions from '@modules/users/utils/validate-permissions';
import HashProvider from '@providers/hash-provider/contracts/models/hash-provider';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import isInGroupUniverse from '@shared/utils/is-in-group-universe';
import { inject, injectable } from 'tsyringe';
import MailProvider from '@providers/mail-provider/contracts/models/mail.provider';
import signUpEmailTemplate from '@providers/mail-provider/templates/sign-up-email-template';
import LogsRepository from '@modules/logs/contracts/repositories/logs-repository';
import LogType from '@modules/logs/contracts/enums/log-type.enum';

interface Request {
  userId: string;
  email: string;
  name: string;
  groupIds: string[];
  permissions: Permissions;
  phoneNumber?: string;
}

@injectable()
class CreateManagerService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('MailProvider')
    private mailProvider: MailProvider,

    @inject('HashProvider')
    private hashProvider: HashProvider,

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

    if (user.role !== Role.OWNER && !user.permissions?.createManagers)
      throw AppError.authorizationError;

    if (
      !validatePermissions({
        for: 'MANAGER',
        permissions,
      })
    )
      throw AppError.incorrectPermissionsForManager;

    email = email.toLowerCase();

    const emailExists = await this.usersRepository.findOne({
      by: 'email',
      value: email,
    });

    if (emailExists) throw AppError.emailAlreadyUsed;

    const password = randomBytes(3).toString('hex');

    const manager = this.usersRepository.create({
      email,
      password: this.hashProvider.hash(password),
      name,
      role: Role.MANAGER,
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
      receiverName: manager.name,
      receiverEmail: manager.email,
      password,
    });

    this.mailProvider.send({
      receiverName: manager.name,
      receiverEmail: manager.email,
      subject: mailData.subject,
      html: mailData.htmlBody,
      text: mailData.plainText,
    });

    this.logsRepository.create({
      createdBy: user.id,
      groupId: undefined,
      ownerId: user.ownerId || user.id,
      type: LogType.CREATE_MANAGER,
      userId: manager.id,
    });

    await this.ormProvider.commit();

    return manager;
  }
}

export default CreateManagerService;
