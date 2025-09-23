import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class WhatsAppTemplateCreatedAt1758263535015 implements MigrationInterface {
    name = 'WhatsAppTemplateCreatedAt1758263535015'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
