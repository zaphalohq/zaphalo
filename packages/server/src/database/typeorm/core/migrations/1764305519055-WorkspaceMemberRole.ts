import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkspaceMemberRole1764305519055 implements MigrationInterface {
    name = 'WorkspaceMemberRole1764305519055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ALTER COLUMN "role" SET DEFAULT 'admin'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ALTER COLUMN "role" SET DEFAULT 'user'`);
    }

}
