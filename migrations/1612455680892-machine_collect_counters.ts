import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class machineCollectCounters1612455680892
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'machine_collect_counters',
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
          {
            name: 'counter_id',
            type: 'int',
          },
          {
            name: 'machine_collect_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'machine_collect_counters',
      new TableForeignKey({
        name: 'machine_collection_counter_counters',
        referencedTableName: 'counters',
        referencedColumnNames: ['id'],
        columnNames: ['counter_id'],
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'machine_collect_counters',
      new TableForeignKey({
        name: 'machine_collect_counter_machine_collection',
        referencedTableName: 'machine_collection',
        referencedColumnNames: ['id'],
        columnNames: ['machine_collect_id'],
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('machine_collect_counters');
  }
}
