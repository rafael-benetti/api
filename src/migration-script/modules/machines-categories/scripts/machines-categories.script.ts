/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { inject, injectable } from 'tsyringe';
import OrmProvider from '@providers/orm-provider/contracts/models/orm-provider';
import Redis from 'ioredis';
import TypeCompaniesRepository from 'migration-script/modules/companies/typeorm/repositories/type-companies.repository';
import CategoriesRepository from '@modules/categories/contracts/repositories/categories.repository';
import CounterTypesRepository from '@modules/counter-types/contracts/repositories/couter-types.repository';
import Counter from '@modules/machines/contracts/models/counter';
import AppError from '@shared/errors/app-error';
import Box from '@modules/machines/contracts/models/box';
import logger from '@config/logger';
import TypeUsersRepository from 'migration-script/modules/users/typeorm/repostories/type-users-repository';
import MachineCategoriesRepository from '../typeorm/repositories/type-machine-categories.repository';

@injectable()
class MachineCategoriesScript {
  private client = new Redis();

  constructor(
    @inject('TypeCompaniesRepository')
    private typeCompaniesRepository: TypeCompaniesRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: CategoriesRepository,

    @inject('MachineCategoriesRepository')
    private machineCategoriesRepository: MachineCategoriesRepository,

    @inject('CounterTypesRepository')
    private counterTypesRepository: CounterTypesRepository,

    @inject('TypeUsersRepository')
    private typeUsersRepository: TypeUsersRepository,

    @inject('OrmProvider')
    private ormProvider: OrmProvider,
  ) {}

  async execute(): Promise<void> {
    this.ormProvider.clear();

    const typeUsers = await this.typeUsersRepository.find();

    const typeOwners = typeUsers.filter(
      typeUser => typeUser.id === typeUser.ownerId,
    );

    try {
      for (const typeOwner of typeOwners) {
        const ownerId = (await this.client.get(
          `@users:${typeOwner.id}`,
        )) as string;

        const typeMachineCategories = await this.machineCategoriesRepository.listAllCategories(
          typeOwner.id,
        );

        for (const typeMachineCategory of typeMachineCategories) {
          const counters: Counter[] = [];
          const boxes: Box[] = [];
          const counterTypes = await this.counterTypesRepository.find({
            ownerId,
          });

          const counterTypeIdIn = counterTypes.find(
            counterType => counterType.label === 'Noteiro',
          )?.id;

          const counterTypeIdOut = counterTypes.find(
            counterType => counterType.label === 'Prêmio',
          )?.id;

          if (!counterTypeIdIn || !counterTypeIdOut)
            throw AppError.counterTypeNotFound;

          if (
            typeMachineCategory.name === 'Vintage' ||
            typeMachineCategory.name === 'Tomacat' ||
            typeMachineCategory.name === 'Magic Bear' ||
            typeMachineCategory.name === 'Luck Star' ||
            typeMachineCategory.name === 'Grua Lucky Star' ||
            typeMachineCategory.name === 'Grua Black' ||
            typeMachineCategory.name === 'Black' ||
            typeMachineCategory.name === 'Big Mega Plush' ||
            typeMachineCategory.name === 'Big Black'
          ) {
            boxes.push(
              new Box({
                // ? CONTADOR DE SAIDA
                counters: [
                  new Counter({
                    counterTypeId: counterTypeIdOut,
                    hasDigital: false,
                    hasMechanical: false,
                    pin: undefined,
                  }),
                  // ? CONTADOR DE ENTRADA
                  new Counter({
                    counterTypeId: counterTypeIdIn,
                    hasDigital: false,
                    hasMechanical: false,
                    pin: undefined,
                  }),
                ],
              }),
            );
          }

          if (
            typeMachineCategory.name === 'Mega Plush' ||
            typeMachineCategory.name === 'MAQ. DE TIRO'
          ) {
            // ? CONTADORES DE ENTRADA
            for (let i = 0; i < 2; i += 1) {
              counters.push(
                new Counter({
                  counterTypeId: counterTypeIdIn,
                  hasDigital: false,
                  hasMechanical: false,
                  pin: undefined,
                }),
              );
            }
            // ? CONTADOR DE SAIDA
            counters.push(
              new Counter({
                counterTypeId: counterTypeIdOut,
                hasDigital: false,
                hasMechanical: false,
                pin: undefined,
              }),
            );

            boxes.push(
              new Box({
                counters,
              }),
            );
          }

          if (typeMachineCategory.name === 'Tomacat + Dupla') {
            for (let i = 0; i < 3; i += 1) {
              boxes.push(
                new Box({
                  counters: [
                    // ? CONTADORES DE ENTRADA
                    new Counter({
                      counterTypeId: counterTypeIdIn,
                      hasDigital: false,
                      hasMechanical: false,
                      pin: undefined,
                    }),
                    // ? CONTADORES DE SAIDA
                    new Counter({
                      counterTypeId: counterTypeIdOut,
                      hasDigital: false,
                      hasMechanical: false,
                      pin: undefined,
                    }),
                  ],
                }),
              );
            }
          }

          if (
            typeMachineCategory.name === 'Caminhão' ||
            typeMachineCategory.name === 'Big Truck'
          ) {
            for (let i = 0; i < 6; i += 1) {
              boxes.push(
                new Box({
                  counters: [
                    // ? CONTADORES DE ENTRADA
                    new Counter({
                      counterTypeId: counterTypeIdIn,
                      hasDigital: false,
                      hasMechanical: false,
                      pin: undefined,
                    }),
                    // ? CONTADORES DE SAIDA
                    new Counter({
                      counterTypeId: counterTypeIdOut,
                      hasDigital: false,
                      hasMechanical: false,
                      pin: undefined,
                    }),
                  ],
                }),
              );
            }
          }

          if (typeMachineCategory.name === 'Roleta') {
            // ? CONTADORES DE ENTRADA
            counters.push(
              new Counter({
                counterTypeId: counterTypeIdIn,
                hasDigital: false,
                hasMechanical: false,
                pin: undefined,
              }),
            );

            // ? CONTADORES DE SAIDA
            for (let i = 0; i < 9; i += 1) {
              counters.push(
                new Counter({
                  counterTypeId: counterTypeIdOut,
                  hasDigital: false,
                  hasMechanical: false,
                  pin: undefined,
                }),
              );
            }

            boxes.push(
              new Box({
                counters,
              }),
            );
          }

          const category = this.categoriesRepository.create({
            label: typeMachineCategory.name,
            ownerId,
            boxes,
          });

          await this.client.set(
            `@categories:${typeMachineCategory.id}`,
            `${category.id}`,
          );
        }
      }
    } catch (error) {
      logger.info(error);
    }

    await this.ormProvider.commit();
  }
}

export default MachineCategoriesScript;
