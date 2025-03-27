import { MigrationInterface, QueryRunner } from "typeorm";

export class Abc1742731407455 implements MigrationInterface {
    name = 'Abc1742731407455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."channel" ADD "channelName2" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."channel" DROP COLUMN "channelName2"`);
    }

}
