import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class machines1612288018740 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'machines',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'serial_number',
            type: 'varchar(25)',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'registration_date',
            type: 'datetime',
            isNullable: false,
          },
          {
            name: 'game_value',
            type: 'decimal(5,2)',
            isNullable: false,
          },
          {
            name: 'last_collection',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'active',
            type: 'tinyint(1)',
            isNullable: false,
            default: 1,
          },
          {
            name: 'company_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'machines',
      new TableForeignKey({
        name: 'machines_companies',
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('machines');
  }
}
