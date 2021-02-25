import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class countersProducts1613666240303
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'counters_products',
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
            isNullable: false,
          },
          {
            name: 'slot',
            type: 'smallint',
            isNullable: false,
          },
          {
            name: 'counter_id',
            type: 'int',
          },
          {
            name: 'product_id',
            type: 'int',
          },
          {
            name: 'machine_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'counters_products',
      new TableForeignKey({
        name: 'counters_products_to_counters',
        referencedTableName: 'counters',
        referencedColumnNames: ['id'],
        columnNames: ['counter_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'counters_products',
      new TableForeignKey({
        name: 'counters_products_to_products',
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        columnNames: ['product_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'counters_products',
      new TableForeignKey({
        name: 'counters_products_to_machines',
        referencedTableName: 'machines',
        referencedColumnNames: ['id'],
        columnNames: ['machine_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('counters_products');
  }
}
