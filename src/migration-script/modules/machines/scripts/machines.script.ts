/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import Redis from 'ioredis';
import MachinesRepository from '@modules/machines/contracts/repositories/machines.repository';
import GroupsRepository from '@modules/groups/contracts/repositories/groups.repository';
import AppError from '@shared/errors/app-error';
import Box from '@modules/machines/contracts/models/box';
import Counter from '@modules/machines/contracts/models/counter';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import UsersRepository from '@modules/users/contracts/repositories/users.repository';
import Role from '@modules/users/contracts/enums/role';
import CategoriesRepository from '@modules/categories/contracts/repositories/categories.repository';
import logger from '@config/logger';
import Type from '@modules/counter-types/contracts/enums/type';
import TypeMachinesRepository from '../typeorm/repositories/type-machines.repository';

@injectable()
class MachinesScript {
  private client = new Redis();

  constructor(
    @inject('TypeMachinesRepository')
    private typeMachinesRepository: TypeMachinesRepository,

    @inject('MachinesRepository')
    private machinesRepository: MachinesRepository,

    @inject('GroupsRepository')
    private groupsRepository: GroupsRepository,

    @inject('CounterTypesRepository')
    private counterTypesRepository: CounterTypesRepository,

    @inject('UsersRepository')
    private usersRepository: UsersRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: CategoriesRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute(): Promise<void> {
    this.ormProvider.clear();
    const machines = await this.typeMachinesRepository.find();

    try {
      for (const typeMachine of machines) {
        const operatorId = (await this.client.get(
          `@users:${typeMachine.operatorId}`,
        )) as string | undefined;

        const groupId = (await this.client.get(
          `@groups:${typeMachine.companyId}`,
        )) as string;

        const group = await this.groupsRepository.findOne({
          by: 'id',
          value: groupId,
        });

        if (!group) throw AppError.groupNotFound;

        // ANCHOR VERIFICAR QUEM É O DONO DA MAGUINE
        const ownerId = group?.ownerId;

        const boxesIds = [
          ...new Set(
            typeMachine.counters?.map(counter => counter.counterGroupId),
          ),
        ];

        const countersTypes = await this.counterTypesRepository.find({
          ownerId,
        });

        const boxes = boxesIds.map(boxeId => {
          const typeCounters = typeMachine.counters.filter(
            counter => counter.counterGroupId === boxeId,
          );

          const counters = typeCounters.map(typeCounter => {
            let counterType;

            if (
              typeCounter.name.toLowerCase().includes('prize') ||
              typeCounter.name.toLowerCase().includes('premio') ||
              typeCounter.name.toLowerCase().includes('prê') ||
              typeCounter.name.toLowerCase().includes('bolinha') ||
              typeCounter.name.toLowerCase().includes('saida') ||
              typeCounter.name.toLowerCase().includes('saída') ||
              typeCounter.name.toLowerCase().includes('pelu') ||
              typeCounter.name.toLowerCase().includes('bala') ||
              typeCounter.name.toLowerCase().includes('porta a') ||
              typeCounter.name.toLowerCase().includes('porta b') ||
              typeCounter.name.toLowerCase().includes('tomacat')
            )
              counterType = countersTypes.find(item => item.label === 'Prêmio');

            if (
              typeCounter.name.toLowerCase().includes('notei') ||
              typeCounter.name.toLowerCase().includes('dinhei')
            )
              counterType = countersTypes.find(
                item => item.label === 'Noteiro',
              );

            if (typeCounter.name.toLowerCase().includes('cart'))
              counterType = countersTypes.find(item => item.label === 'Cartão');

            if (typeCounter.name.toLowerCase().includes('moedei'))
              counterType = countersTypes.find(
                item => item.label === 'Moedeiro',
              );

            if (
              typeCounter.name.toLowerCase().includes('cré') ||
              typeCounter.name.toLowerCase().includes('cre') ||
              typeCounter.name.toLowerCase().includes('entrada') ||
              typeCounter.name.toLowerCase().includes('coin') ||
              typeCounter.name.toLowerCase().includes('box') ||
              typeCounter.name.toLowerCase().includes('0') ||
              typeCounter.name.toLowerCase().includes('haste')
            )
              counterType = countersTypes.find(item => item.label === 'Misto');

            if (!counterType) {
              logger.info(ownerId);
              logger.info(countersTypes);
              logger.info(typeCounter.name);
              throw AppError.counterTypeNotFound;
            }

            return new Counter({
              counterTypeId: counterType.id,
              hasDigital: typeCounter.hasDigital === 1,
              hasMechanical: typeCounter.hasMechanical === 1,
              pin: typeCounter.pin
                ? `Pino ${typeCounter.pin?.toString()}`
                : undefined,
            });
          });

          return new Box({
            counters,
          });
        });

        const telemetryBoardId = await this.client.get(
          `@telemetryBoards:${typeMachine.telemetryId}`,
        );

        const categoryId = (await this.client.get(
          `@categories:${typeMachine.machineCategoryId}`,
        )) as string;

        const category = await this.categoriesRepository.findOne({
          by: 'id',
          value: categoryId,
        });

        const machine = this.machinesRepository.create({
          gameValue: Number(typeMachine.gameValue),
          isActive: typeMachine.active === 1,
          serialNumber: typeMachine.serialNumber,
          operatorId,
          ownerId,
          groupId,
          locationId: undefined,
          telemetryBoardId: telemetryBoardId
            ? Number(telemetryBoardId)
            : undefined,
          categoryId,
          categoryLabel: category?.label ? category.label : '',
          boxes,
        });

        await this.client.set(`@machines:${typeMachine.id}`, `${machine.id}`);
      }
    } catch (error) {
      logger.info(error);
    }

    await this.ormProvider.commit();
  }

  async createCountersTypes(): Promise<void> {
    this.ormProvider.clear();

    const users = await this.usersRepository.find({
      filters: {
        role: Role.OWNER,
      },
    });

    users.forEach(user => {
      this.counterTypesRepository.create({
        label: 'Moedeiro',
        type: Type.IN,
        ownerId: user.id,
      });

      this.counterTypesRepository.create({
        label: 'Noteiro',
        type: Type.IN,
        ownerId: user.id,
      });

      this.counterTypesRepository.create({
        label: 'Cartão',
        type: Type.IN,
        ownerId: user.id,
      });

      this.counterTypesRepository.create({
        label: 'Crédito Remoto',
        type: Type.IN,
        ownerId: user.id,
      });

      this.counterTypesRepository.create({
        label: 'Prêmio',
        type: Type.OUT,
        ownerId: user.id,
      });

      this.counterTypesRepository.create({
        label: 'Misto',
        type: Type.IN,
        ownerId: user.id,
      });

      this.counterTypesRepository.create({
        label: 'Ficheiro',
        type: Type.IN,
        ownerId: user.id,
      });
    });

    await this.ormProvider.commit();
  }
}

export default MachinesScript;
