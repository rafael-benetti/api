import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class couter1612452954580 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'counters',
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
            isNullable: false,
          },
          {
            name: 'slot',
            type: 'smallint',
            isNullable: false,
          },
          {
            name: 'has_digital',
            type: 'tinyint',
            isNullable: false,
          },
          {
            name: 'has_mechanical',
            type: 'tinyint',
            isNullable: false,
          },
          {
            name: 'pin',
            type: 'smallint',
          },
          {
            name: 'pulse_value',
            type: 'decimal(5,2)',
            isNullable: false,
          },
          {
            name: 'machine_id',
            type: 'int',
          },
          {
            name: 'type_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'counters',
      new TableForeignKey({
        name: 'counters_counter_types',
        referencedTableName: 'counter_types',
        referencedColumnNames: ['id'],
        columnNames: ['type_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'counters',
      new TableForeignKey({
        name: 'counter_machines',
        referencedTableName: 'machines',
        referencedColumnNames: ['id'],
        columnNames: ['machine_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('counters');
  }
}
