import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';


export class New1758803437586 implements MigrationInterface {
    name = 'New1758803437586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" ADD "address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        await queryRunner.query(`ALTER TABLE "${schema}"."contacts" DROP COLUMN "address"`);
    }

}
