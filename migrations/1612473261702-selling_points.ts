import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class sellingPoints1612473261702 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'selling_points',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'address_id',
            type: 'int',
            isUnique: true,
          },
          {
            name: 'company_id',
            type: 'int',
          },
          {
            name: 'name',
            type: 'varchar(100)',
          },
          {
            name: 'responsible',
            type: 'varchar(100)',
          },
          {
            name: 'phone1',
            type: 'varchar(15)',
          },
          {
            name: 'phone2',
            type: 'varchar(15)',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'selling_points',
      new TableForeignKey({
        name: 'selling_points_address',
        referencedTableName: 'addresses',
        referencedColumnNames: ['id'],
        columnNames: ['address_id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('selling_points');
  }
}
