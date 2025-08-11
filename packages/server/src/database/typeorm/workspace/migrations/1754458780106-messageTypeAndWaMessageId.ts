import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class MessageTypeAndWaMessageId1754458780106 implements MigrationInterface {
    name = 'MessageTypeAndWaMessageId1754458780106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" ADD "messageType" character varying`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" ADD "waMessageId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" DROP COLUMN "waMessageId"`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" DROP COLUMN "messageType"`);
    }

}
