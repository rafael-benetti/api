import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class user1612014457903 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
            type: 'varchar(100)',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'phone',
            type: 'varchar(15)',
          },
          {
            name: 'username',
            type: 'varchar(100)',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'active',
            type: 'tinyint',
            default: 1,
          },
          {
            name: 'roles',
            type: 'longtext',
          },
          {
            name: 'is_operator',
            type: 'tinyint',
          },
          {
            name: 'picture',
            type: 'longtext',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
