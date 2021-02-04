import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class counterGroups1612466246633 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'counter_groups',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'machine_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'counter_groups',
      new TableForeignKey({
        name: 'counter_groups_machine',
        referencedTableName: 'machines',
        referencedColumnNames: ['id'],
        columnNames: ['machine_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('counter_groups');
  }
}
