import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkspaceMemberRole1747652127425 implements MigrationInterface {
    name = 'WorkspaceMemberRole1747652127425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "core"."workspace_member_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ADD "role" "core"."workspace_member_role_enum" NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "core"."workspace_member_role_enum"`);
        await queryRunner.query(`ALTER TABLE "core"."workspace_member" ADD "role" character varying(50) NOT NULL DEFAULT 'member'`);
    }

}
