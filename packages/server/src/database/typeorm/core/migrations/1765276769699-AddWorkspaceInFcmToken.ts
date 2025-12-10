import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWorkspaceInFcmToken1765276769699 implements MigrationInterface {
    name = 'AddWorkspaceInFcmToken1765276769699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."fcm_tokens" ADD "workspaceId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."fcm_tokens" DROP COLUMN "workspaceId"`);
    }

}
