import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class machineCollectCounter1612453680892
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'machine_collect_counter',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'is_digital',
            type: 'tinyint(1)',
          },
          {
            name: 'is_mechanical',
            type: 'tinyint(1)',
          },
          {
            name: 'is_counted',
            type: 'tinyint(1)',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('machine_collect_counter');
  }
}
