import Role from '@modules/users/contracts/enums/role';
import Permissions from '@modules/users/contracts/models/permissions';
import User from '@modules/users/contracts/models/user';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import validatePermissions from '@modules/users/utils/validate-permissions';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import AppError from '@shared/errors/app-error';
import getGroupUniverse from '@shared/utils/get-group-universe';
import isInGroupUniverse from '@shared/utils/is-in-group-universe';
import { inject, injectable } from 'tsyringe';

interface Request {
  userId: string;
  operatorId: string;
  groupIds?: string[];
  permissions?: Permissions;
  phoneNumber?: string;
  isActive?: boolean;
}

@injectable()
class EditOperatorService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute({
    userId,
    operatorId,
    groupIds,
    permissions,
    phoneNumber,
    isActive,
  }: Request): Promise<User> {
    const user = await this.usersRepository.findOne({
      by: 'id',
      value: userId,
    });

    if (!user) throw AppError.userNotFound;

    if (user.role !== Role.OWNER && !user.permissions?.createOperators)
      throw AppError.authorizationError;

    const operator = await this.usersRepository.findOne({
      by: 'id',
      value: operatorId,
    });

    if (!operator) throw AppError.userNotFound;

    if (operator.role !== Role.OPERATOR) throw AppError.userNotFound;

    if (operator.groupIds?.every(groupId => !user.groupIds?.includes(groupId)))
      throw AppError.authorizationError;

    if (groupIds) {
      const universe = await getGroupUniverse(user);
      if (
        !isInGroupUniverse({
          groups: groupIds,
          universe,
          method: 'INTERSECTION',
        })
      )
        throw AppError.authorizationError;

      const uncommonGroups = operator.groupIds?.filter(
        group =>
          !operator.groupIds
            ?.filter(group => user.groupIds?.includes(group))
            ?.includes(group),
      );

      operator.groupIds = [...groupIds, ...(uncommonGroups || [])];
    }

    if (permissions) {
      if (
        !validatePermissions({
          for: 'OPERATOR',
          permissions,
        })
      )
        throw AppError.incorrectPermissionsForOperator;

      operator.permissions = permissions;
    }

    if (phoneNumber) operator.phoneNumber = phoneNumber;
    if (isActive !== undefined) operator.isActive = isActive;

    this.usersRepository.save(operator);

    await this.ormProvider.commit();

    return operator;
  }
}

export default EditOperatorService;
