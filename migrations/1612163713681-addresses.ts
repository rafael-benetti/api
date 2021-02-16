import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class addresses1612163713681 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'zip_code',
            type: 'varchar(8)',
          },
          {
            name: 'state',
            type: 'varchar(100)',
          },
          {
            name: 'city',
            type: 'varchar(100)',
          },
          {
            name: 'neighborhood',
            type: 'varchar(100)',
          },
          {
            name: 'street',
            type: 'varchar(100)',
          },
          {
            name: 'number',
            type: 'int',
          },
          {
            name: 'note',
            type: 'varchar(100)',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addresses');
  }
}
