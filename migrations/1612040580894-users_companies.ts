import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class usersCompanies1612040580894 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_company',
        columns: [
          {
            name: 'user_id',
            isPrimary: true,
            type: 'int',
          },
          {
            name: 'company_id',
            isPrimary: true,
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'user_company',
      new TableForeignKey({
        name: 'user_company',
        referencedTableName: 'users',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user_company',
      new TableForeignKey({
        name: 'company_user',
        referencedTableName: 'companies',
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_company');
  }
}
