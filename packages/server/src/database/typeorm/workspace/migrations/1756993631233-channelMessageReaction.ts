import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class ChannelMessageReaction1756993631233 implements MigrationInterface {
    name = 'ChannelMessageReaction1756993631233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`CREATE TABLE "${schema}"."channelMessageReaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "contactName" character varying NOT NULL, "senderId" uuid, "channelMessageId" uuid, CONSTRAINT "PK_b23e33788eca0173ce88c57e1d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "${schema}"."channel" DROP COLUMN "membersidsss"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD "quality" character varying NOT NULL DEFAULT 'none'`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" ADD "failureReason" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."channelMessageReaction" ADD CONSTRAINT "FK_9fc87d60323c73d844a3ae23fc6" FOREIGN KEY ("senderId") REFERENCES "${schema}"."contacts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "${schema}"."channelMessageReaction" ADD CONSTRAINT "FK_eb1a86b333de19aa6c9bc5f0e49" FOREIGN KEY ("channelMessageId") REFERENCES "${schema}"."messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        
        await queryRunner.query(`ALTER TABLE "${schema}"."channelMessageReaction" DROP CONSTRAINT "FK_eb1a86b333de19aa6c9bc5f0e49"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."channelMessageReaction" DROP CONSTRAINT "FK_9fc87d60323c73d844a3ae23fc6"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP COLUMN "failureReason"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."whatsAppTemplate" DROP COLUMN "quality"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."channel" ADD "membersidsss" character varying`);
        await queryRunner.query(`DROP TABLE "${schema}"."channelMessageReaction"`);
    }

}
