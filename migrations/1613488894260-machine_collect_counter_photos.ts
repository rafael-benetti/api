import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class machineCollectCounterPhotos1613488894260
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'machine_collect_counter_photos',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'photo',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'key',
            type: 'varchar',
            isNullable: false,
          },
          // {
          //  name: 'counter_id',
          //  type: 'int',
          // },
          // {
          //  name: 'machine_collect_counter_id',
          //  type: 'int',
          // },
          {
            name: 'machine_collect_id',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'machine_collect_counter_photos',
      new TableForeignKey({
        name: 'machine_collect_counter_photos_machine_collect',
        referencedTableName: 'machine_collection',
        referencedColumnNames: ['id'],
        columnNames: ['machine_collect_id'],
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    );

    // await queryRunner.createForeignKey(
    //  'machine_collect_counter_photos',
    //  new TableForeignKey({
    //    name: 'machine_collect_counter_photos_counters',
    //    referencedTableName: 'counters',
    //    referencedColumnNames: ['id'],
    //    columnNames: ['counter_id'],
    //    onDelete: 'CASCADE',
    //    onUpdate: 'CASCADE',
    //  }),
    // );

    // await queryRunner.createForeignKey(
    //   'machine_collect_counter_photos',
    //   new TableForeignKey({
    //     name: 'machine_collect_counter_photos_machine_collect_counters',
    //     referencedTableName: 'machine_collect_counters',
    //     referencedColumnNames: ['id'],
    //     columnNames: ['machine_collect_counter_id'],
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE',
    //   }),
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('machine_collect_counter_photos');
  }
}
