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
import TypeMachinesRepository from '../typeorm/repositories/type-machines.repository';

@injectable()
class UserScript {
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

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute(): Promise<void> {
    this.ormProvider.clear();
    const machines = await this.typeMachinesRepository.find();

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
        ...new Set(typeMachine.counters.map(counter => counter.counterGroupId)),
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
            typeCounter.name.toLowerCase().includes('prê') ||
            typeCounter.name.toLowerCase().includes('bolinha') ||
            typeCounter.name.toLowerCase().includes('bala') ||
            typeCounter.name.toLowerCase().includes('porta a') || // ANCHOR ANALIZAR O PORQUE ESVA NA CATEGORIA MISTO SE É UMA SAIDA
            typeCounter.name.toLowerCase().includes('porta b') || // ANCHOR ANALIZAR
            typeCounter.name.toLowerCase().includes('tomacat') // ANCHOR ANALIZAR
          )
            counterType = countersTypes.find(item => item.label === 'Prêmio');

          if (
            typeCounter.name.toLowerCase().includes('notei') ||
            typeCounter.name.toLowerCase().includes('dinhei')
          )
            counterType = countersTypes.find(item => item.label === 'Noteiro');

          if (typeCounter.name.toLowerCase().includes('cart'))
            counterType = countersTypes.find(item => item.label === 'Cartão');

          if (typeCounter.name.toLowerCase().includes('moedei'))
            counterType = countersTypes.find(item => item.label === 'Moedeiro');

          if (
            typeCounter.name.toLowerCase().includes('cré') ||
            typeCounter.name.toLowerCase().includes('cre') ||
            typeCounter.name.toLowerCase().includes('entrada') ||
            typeCounter.name.toLowerCase().includes('coin') ||
            typeCounter.name.toLowerCase().includes('box')
          )
            counterType = countersTypes.find(item => item.label === 'Misto');

          if (!counterType) throw AppError.counterTypeNotFound;

          return new Counter({
            counterTypeId: counterType.id,
            hasDigital: typeCounter.hasDigital === 1,
            hasMechanical: typeCounter.hasMechanical === 1,
            pin: typeCounter.pin.toString(),
          });
        });

        return new Box({
          counters,
        });
      });

      const machine = this.machinesRepository.create({
        gameValue: typeMachine.gameValue,
        isActive: typeMachine.active === 1,
        serialNumber: typeMachine.serialNumber,
        operatorId,
        ownerId,
        groupId,
        locationId: typeMachine.sellingPointId.toString(), // TODO TROCAR PARA O NOVO ID
        telemetryBoardId: typeMachine.telemetryBoardId, // TODO TROCAR PARA O NOVO ID
        categoryId: typeMachine.machineCategoryId.toString(), // TODO TROCAR PARA O NOVO ID
        categoryLabel: '', // TODO: RELACIONAR O LABEL
        boxes,
      });

      await this.client.set(`@machines:${typeMachine.id}`, `${machine.id}`);
    }

    await this.ormProvider.commit();
  }

  async createCountersTypes(): Promise<void> {
    const users = await this.usersRepository.find({
      filters: {
        role: Role.OWNER,
      },
    });

    users.forEach(user => {
      this.counterTypesRepository.create({
        label: 'Moedeiro',
        type: 'IN',
        ownerId: user.id,
      });

      this.counterTypesRepository.create({
        label: 'Noteiro',
        type: 'IN',
        ownerId: user.id,
      });

      this.counterTypesRepository.create({
        label: 'Cartão',
        type: 'IN',
        ownerId: user.id,
      });

      this.counterTypesRepository.create({
        label: 'Crédito Remoto',
        type: 'IN',
        ownerId: user.id,
      });

      this.counterTypesRepository.create({
        label: 'Prêmio',
        type: 'OUT',
        ownerId: user.id,
      });

      this.counterTypesRepository.create({
        label: 'Misto',
        type: 'IN',
        ownerId: user.id,
      });

      this.counterTypesRepository.create({
        label: 'Ficheiro',
        type: 'IN',
        ownerId: user.id,
      });
    });
  }
}

export default UserScript;
