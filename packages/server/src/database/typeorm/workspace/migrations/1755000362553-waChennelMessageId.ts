import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class WaChennelMessageId1755000362553 implements MigrationInterface {
    name = 'WaChennelMessageId1755000362553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" DROP COLUMN "htmlBody"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ADD "body" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ADD "channelMessageIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ALTER COLUMN "messageFailureType" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ALTER COLUMN "failureReason" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ALTER COLUMN "freeTextJson" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ALTER COLUMN "msgUid" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ADD CONSTRAINT "FK_ebcfadfd7734f9e2363a31bdd83" FOREIGN KEY ("channelMessageIdId") REFERENCES "${schema}"."messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" DROP CONSTRAINT "FK_ebcfadfd7734f9e2363a31bdd83"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ALTER COLUMN "msgUid" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ALTER COLUMN "freeTextJson" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ALTER COLUMN "failureReason" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ALTER COLUMN "messageFailureType" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" DROP COLUMN "channelMessageIdId"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" DROP COLUMN "body"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppMessage" ADD "htmlBody" character varying NOT NULL`);
    }

}
