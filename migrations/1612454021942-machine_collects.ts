import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class machineCollects1612454021942
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'machine_collects',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'collection_date',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'active',
            type: 'tinyint',
            isNullable: false,
          },
          {
            name: 'previous_collection_id',
            type: 'int',
            isUnique: true,
          },
          {
            name: 'machine_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'machine_collects',
      new TableForeignKey({
        name: 'machine_collects_machine',
        referencedTableName: 'machines',
        referencedColumnNames: ['id'],
        columnNames: ['machine_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'machine_collects',
      new TableForeignKey({
        name: 'machine_collects_user',
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        columnNames: ['user_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'machine_collects',
      new TableForeignKey({
        name: 'machine_collects_machine_collects',
        referencedTableName: 'machine_collects',
        referencedColumnNames: ['id'],
        columnNames: ['previous_collection_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('machine_collects');
  }
}
