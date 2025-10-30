import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class WaWebhookToken1754298021474 implements MigrationInterface {
    name = 'WaWebhookToken1754298021474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppAccount" ADD "waWebhookToken" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppAccount" DROP COLUMN "waWebhookToken"`);
    }

}
