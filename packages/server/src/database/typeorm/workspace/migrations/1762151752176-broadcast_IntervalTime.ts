import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';


export class Broadcast_IntervalTime1762151752176 implements MigrationInterface {
    name = 'Broadcast_IntervalTime1762151752176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`CREATE TYPE "${schema}"."broadcast_intervaltype_enum" AS ENUM('MINUTE', 'HOUR', 'DAY')`);
        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" ADD "intervalType" "${schema}"."broadcast_intervaltype_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."broadcast" DROP COLUMN "intervalType"`);
        await queryRunner.query(`DROP TYPE "${schema}"."broadcast_intervaltype_enum"`);
    }

}
