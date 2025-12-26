import { MigrationInterface, QueryRunner } from "typeorm";
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';


export class ChannelMessageStateEnum1766560785719 implements MigrationInterface {
    name = 'ChannelMessageStateEnum1766560785719'

    public async up(queryRunner: QueryRunner): Promise<void> {

        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`CREATE TYPE "${schema}"."channel_message_state_enum" AS ENUM('In Queue', 'Sent', 'Delivered', 'Read', 'Failed')`);
        await queryRunner.query(`ALTER TABLE "${schema}"."messages" ADD "state" "${schema}"."channel_message_state_enum" NOT NULL DEFAULT 'In Queue'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const { schema } = queryRunner.connection.options as PostgresConnectionOptions;

        await queryRunner.query(`ALTER TABLE "${schema}"."messages" DROP COLUMN "state"`);
        await queryRunner.query(`DROP TYPE "${schema}"."channel_message_state_enum"`);
    }

}
